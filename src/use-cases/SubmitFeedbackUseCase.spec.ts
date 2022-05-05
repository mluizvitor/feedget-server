import { SubmitFeedbackUseCase } from "./SubmitFeedbackUseCase";

const createFeedbackSpy = jest.fn();
const sendMailSpy = jest.fn()

const submitFeedback = new SubmitFeedbackUseCase(
  { create: createFeedbackSpy },
  { sendMail: sendMailSpy }
);

describe('Submit feedback', () => {
  it('should be able to submit a feedback', async () => {
    await expect(submitFeedback.execute({
      type: "BUG",
      comment: "Example comment",
      screenshot: "data:image/png;base64,dsdsdsdsdsdgere33434"
    })).resolves.not.toThrow()

    expect(createFeedbackSpy).toHaveBeenCalled();
    expect(sendMailSpy).toHaveBeenCalled();
  });

  it('should not be able to submit a feedback without type', async () => {
    await expect(submitFeedback.execute({
      type: "",
      comment: "Example comment",
      screenshot: "data:image/png;base64,dsdsdsdsdsdgere33434"
    })).rejects.toThrow()
  });

  it('should not be able to submit a feedback without comment', async () => {
    await expect(submitFeedback.execute({
      type: "BUG",
      comment: "",
      screenshot: "data:image/png;base64,dsdsdsdsdsdgere33434"
    })).rejects.toThrow()
  });

  it('should not be able to submit a feedback an invalid screenshot', async () => {
    await expect(submitFeedback.execute({
      type: "BUG",
      comment: "Example comment",
      screenshot: "test.jpg"
    })).rejects.toThrow()
  });
})