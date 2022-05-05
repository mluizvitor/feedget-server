import { MailAdapter } from "../adapters/MailAdapter";
import { FeedbacksRepository } from "../repositories/FeedbacksRepository";

interface SubmitFeedbackUseCaseRequest {
  type: string;
  comment: string;
  screenshot?: string;
}

/**
 * 
 * Executa o que é necessário para o Use Case.
 * O Constructor que irá receber as dependências, tanto o que é necessário para
 * a criação no banco de dados, quanto o envio de email
 * 
 */

export class SubmitFeedbackUseCase {
  constructor(
    private feedbackRepository: FeedbacksRepository,
    private mailAdapter: MailAdapter
  ) {}

  async execute(request: SubmitFeedbackUseCaseRequest) {
    const { type, comment, screenshot } = request;
  
    /**
     * executa o método create com os dados recebidos da request,
     * independente da biblioteca utilizada para salvar no banco de dados
    */
    await this.feedbackRepository.create({
      type,
      comment,
      screenshot
    })

    /**
     * executa o método sendMail com os dados recebidos da request,
     * independente da biblioteca utilizada para envio de email
    */
    await this.mailAdapter.sendMail({
      subject: `[${type}] Novo Feedback`,
      body: [
        `<div style="font-family: sans-serif; font-size: 16px, color: #222;">`,
        `<p>Tipo do feedback: <strong>${type}</strong></p>`,
        `<p>Comentário: ${comment}</p>`,
        `</div>`
      ].join('\n')
    })
  }
}