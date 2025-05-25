import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepo } from '../infrastructure';

interface UpdateQuestionPayload {
  questionId: string;
  body: string;
  correctAnswers: string[];
}

export class UpdateQuestionCommand {
  constructor(readonly payload: UpdateQuestionPayload) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionHandler implements ICommandHandler<UpdateQuestionCommand> {
  constructor(private questionRepo: QuestionRepo) {}

  public async execute({ payload: { questionId, correctAnswers, body } }: UpdateQuestionCommand) {
    return this.questionRepo.updateQuestion(questionId, body, correctAnswers);
  }
}
