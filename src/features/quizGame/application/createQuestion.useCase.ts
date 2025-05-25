import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepo } from '../infrastructure';

interface CreateQuestionPayload {
  body: string;
  correctAnswers: string[];
}

export class CreateQuestionCommand {
  constructor(readonly payload: CreateQuestionPayload) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionHandler
  implements ICommandHandler<CreateQuestionCommand>
{
  constructor(private questionRepo: QuestionRepo) {}

  public async execute({ payload }: CreateQuestionCommand) {
    return await this.questionRepo.createQuestion(
      payload.body,
      payload.correctAnswers,
    );
  }
}
