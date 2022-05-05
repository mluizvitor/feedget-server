import { MailAdapter, SendMailData } from "../MailAdapter";
import nodemailer from 'nodemailer';

/**
 * 
 * Essa classe implementa os métodos definidos em MailAdapter,
 * mas não o executa
 * 
 */

export class NodemailerAdapter implements MailAdapter {
  async sendMail({subject, body}: SendMailData) {
    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: `${process.env.SMTP_USER}`,
        pass: `${process.env.SMTP_PASS}`,
      }
    });
    
    await transport.sendMail({
      from: 'Equipe Feedget <oi@feedget.com>',
      to: 'Vitor Monteiro <manutencao@feedget.com>',
      subject,
      html: body,
    })
  };
  
}