import express from  'express'
import nodemailer from  'nodemailer'
import { prisma } from './prisma';

export const routes = express.Router();

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

routes.post('/feedbacks', async (req, res) => {
  const {type, comment, screenshot} = req.body;

  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot
    }
  })

  await transport.sendMail({
    from: 'Equipe Feedget <oi@feedget.com>',
    to: 'Vitor Monteiro <manutencao@feedget.com>',
    subject: `[${type}] Novo Feedback`,
    html: [
      `<div style="font-family: sans-serif; font-size: 16px, color: #222;">`,
      `<p>Tipo do feedback: <strong>${type}</strong></p>`,
      `<p>Comentário: ${comment}</p>`,
      `</div>`
    ].join('\n')
  })

  return res.status(201).json({ data: feedback });
})