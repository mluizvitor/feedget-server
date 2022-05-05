import { prisma } from "../../prisma";
import { FeedbacksCreateData, FeedbacksRepository } from "../FeedbacksRepository";

/**
 * 
 * Implementa os métodos listados em FeedbacksRepository,
 * mas não o executa
 * 
 */
export class PrismaFeedbacksRepository implements FeedbacksRepository {
  async create({ type, comment, screenshot }: FeedbacksCreateData) {
    await prisma.feedback.create({
      data: {
        type,
        comment,
        screenshot
      }
    })
  }
}