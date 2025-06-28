import { AnswerStatus, GameStatus } from '../../../infrastructure/enums';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionViewModel {
  @ApiProperty({
    example: 'f1a2b3c4-5678-90ab-cdef-1234567890ab',
    description: 'Unique identifier of the question',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    example: 'What is the capital of France?',
    description: 'Text content of the question',
  })
  body: string;

  @ApiProperty({
    example: ['Paris'],
    description: 'List of correct answers for the question',
    type: [String],
  })
  correctAnswers: string[];

  @ApiProperty({
    example: true,
    description: 'Indicates whether the question is published and visible to users',
  })
  published: boolean;

  @ApiProperty({
    example: '2024-06-08T12:34:56.789Z',
    description: 'Date and time when the question was created',
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-06-09T09:15:30.000Z',
    description: 'Date and time when the question was last updated (nullable)',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  updatedAt: Date | null;
}

export class GameQuestionViewModel {
  id: string;
  body: string;
}

export class AnswerViewModel {
  addedAt: string;
  questionId: string;
  answerStatus: AnswerStatus;
}

export class PlayerProgressViewModel {
  score: number;
  answers: AnswerViewModel[];
  player: {
    id: string;
    login: string;
  };
}

export class GameViewModel {
  @ApiProperty({
    format: 'uuid',
    description: 'Unique identifier of the game',
    example: 'f1a2b3c4-5678-90ab-cdef-1234567890ab',
  })
  id: string;

  status: GameStatus;

  @ApiProperty({
    type: String,
    nullable: true,
    format: 'date-time',
    example: '2024-06-09T09:15:30.000Z',
    description: 'Date and time when the second player connected',
  })
  startGameDate: Date | null;

  @ApiProperty({
    type: String,
    nullable: true,
    format: 'date-time',
    example: '2024-06-09T09:15:30.000Z',
    description: 'Date and time when the game finished',
  })
  finishGameDate: Date | null;

  @ApiProperty({
    type: String,
    nullable: true,
    format: 'date-time',
    example: '2024-06-09T09:15:30.000Z',
    description: 'Date and time when the game created',
  })
  pairCreatedDate: Date | null;

  questions: GameQuestionViewModel[] | null;

  firstPlayerProgress: PlayerProgressViewModel;

  secondPlayerProgress: PlayerProgressViewModel | null;
}
