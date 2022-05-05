export interface SendMailData {
  subject: string;
  body: string;
}

/**
 * 
 * Essa interface é a que diz quais métodos o MailAdapter pode realizar,
 * mas não o implementa.
 * 
 */

export interface MailAdapter {
  sendMail: (data: SendMailData) => Promise<void>;
}
