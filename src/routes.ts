import express from  'express'
import { NodemailerAdapter } from './adapters/nodemailer/NodemailerAdapter';
import { PrismaFeedbacksRepository } from './repositories/prisma/PrismaFeedbacksRepository';
import { SubmitFeedbackUseCase } from './use-cases/SubmitFeedbackUseCase';

export const routes = express.Router();

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