import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepo } from '../infrastructure';

interface PublishQuestionPayload {
  questionId: string;
  publishStatus: boolean;
}

export class PublishQuestionCommand {
  constructor(readonly payload: PublishQuestionPayload) {}
}

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionHandler implements ICommandHandler<PublishQuestionCommand> {
  constructor(private questionRepo: QuestionRepo) {}

  public async execute({ payload: { questionId, publishStatus } }: PublishQuestionCommand) {
    return this.questionRepo.updatedPublishStatus(questionId, publishStatus);
  }
}
