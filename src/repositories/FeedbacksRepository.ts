export interface FeedbacksCreateData {
  type: string;
  comment: string;
  screenshot?: string;
}

/**
 * 
 * Essa interface é quem diz quais as operações que a aplicação pode fazer 
 * no banco de dados, mas não vai implementá-las
 * 
 */

export interface FeedbacksRepository {
  create: (data: FeedbacksCreateData) => Promise<void>;
}