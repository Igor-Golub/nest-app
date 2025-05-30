import { AnswerStatus, GameStatus } from '../../../infrastructure/enums';

export class QuestionViewModel {
  body: string;

  correctAnswers: string[];
}

export interface GameQuestionViewModel {
  id: string;
  body: string;
}

export interface AnswerViewModel {
  addedAt: Date;
  questionId: string;
  answerStatus: AnswerStatus;
}

export interface PlayerViewModel {
  score: number;
  answers: AnswerViewModel[];
  player: {
    id: string;
    login: string;
  };
}

export interface GameViewModel {
  id: string;
  status: GameStatus;
  startGameDate: Date;
  finishGameDate: Date;
  pairCreatedDate: Date;
  questions: GameQuestionViewModel[];
  firstPlayerProgress: PlayerViewModel;
  secondPlayerProgress: PlayerViewModel;
}
