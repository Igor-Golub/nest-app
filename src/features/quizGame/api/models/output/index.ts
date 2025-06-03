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

export interface PlayerProgressViewModel {
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
  startGameDate: Date | null;
  finishGameDate: Date | null;
  pairCreatedDate: Date | null;
  questions: GameQuestionViewModel[] | null;
  firstPlayerProgress: PlayerProgressViewModel;
  secondPlayerProgress: PlayerProgressViewModel | null;
}
