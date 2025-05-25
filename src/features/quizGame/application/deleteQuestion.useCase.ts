import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepo } from '../infrastructure';

interface DeleteQuestionPayload {
  questionId: string;
}

export class DeleteQuestionCommand {
  constructor(readonly payload: DeleteQuestionPayload) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionHandler implements ICommandHandler<DeleteQuestionCommand> {
  constructor(private questionRepo: QuestionRepo) {}

  public async execute({ payload: { questionId } }: DeleteQuestionCommand) {
    return this.questionRepo.delete(questionId);
  }
}
