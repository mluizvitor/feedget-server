import express, { Request, Response } from  'express'
import jwt from 'jsonwebtoken';
import { NodemailerAdapter } from './adapters/nodemailer/NodemailerAdapter';
import { PrismaFeedbacksRepository } from './repositories/prisma/PrismaFeedbacksRepository';
import { SubmitFeedbackUseCase } from './use-cases/SubmitFeedbackUseCase';
import { get } from 'lodash';

import queryString = require('querystring');

import axios from 'axios';

export const routes = express.Router();

async function getGithubUser({code}: {code: string}) {
  const githubToken = await axios
  .post(
    `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`
  )
  .then(res => res.data)
  .catch(error => {
    throw error
  });

  const decoded = queryString.parse(githubToken);

  return await axios.get(
    'https://api.github.com/user', {
      headers: {
        Authorization: 'Bearer ' + decoded.access_token,
      }
    }
  )
  .then( res => {
      return res.data
    }
  )
  .catch(error => {
    throw new Error(error);
  })
}

routes.get('/api/auth/github', async (req: Request, res: Response) => {
  const requestCode = get(req, 'query.code');

  if(!requestCode) {
    throw new Error('No code received');
  }

  const getUserFromGithub = await getGithubUser({code: requestCode});
  
  if(!getUserFromGithub) {
    console.log('Error getting')
    return;
  }

  const token = jwt.sign(getUserFromGithub, process.env.JWT_SECRET!, {
    expiresIn: 60 * 60 * 24 * 7 // 7 days in s
  });

  res.cookie(process.env.COOKIE_NAME!, token, {
    httpOnly: true,
    domain: process.env.COOKIE_DOMAIN!,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in ms
  })

  res.redirect(process.env.WEB_CLIENT_DOMAIN!);
});

routes.get('/api/logout', async (req: Request, res: Response) => {
  await res.clearCookie(process.env.COOKIE_NAME!);
  return res.send('Logged out')
});

routes.get('/api/me', (req: Request, res: Response) => {
  const tokenToVerify = get(req, `cookies[${process.env.COOKIE_NAME!}]`);
  
  try {
    const decodedToken = jwt.verify(tokenToVerify, process.env.JWT_SECRET!)
    
    return res.send(decodedToken)
  } catch(error) {
    return res.send(null)
  }
});

routes.post('/feedbacks', async (req, res) => {
  const {type, comment, screenshot} = req.body;


  const prismaFeedbacksRepository = new PrismaFeedbacksRepository();
  const nodemailerAdapter = new NodemailerAdapter();
  
  /**
   * O UseCase de submissão do feedback irá receber as dependências
   * na ordem que foi definida em seu construtor. 
   * Aqui é usada a Inversão de Dependência.
   */
  const submitFeedbackUseCase = new SubmitFeedbackUseCase(
    prismaFeedbacksRepository,
    nodemailerAdapter
  );

  /**
   * Executa o que foi definido em submitFeedbackUseCase, passando os
   * dados necessários para os métodos internos. Esses métodos serão
   * executados utilizando as dependências definidas anteriormente.
   */
  await submitFeedbackUseCase.execute({
    type,
    comment,
    screenshot
  })

  return res.status(201).send();
})