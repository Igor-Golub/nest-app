import { Answer, Game, type Participant, Question } from '../../../domain';
import {
  AnswerViewModel,
  GameQuestionViewModel,
  GameViewModel,
  PlayerProgressViewModel,
  QuestionViewModel,
} from '../output';

export class GameMapManager {
  static mapAnswersToView(answer: Answer): AnswerViewModel {
    return {
      answerStatus: answer.status,
      questionId: answer.question.id,
      addedAt: answer.createdAt.toISOString(),
    };
  }

  static mapQuestionsToView(question: Question): GameQuestionViewModel {
    return {
      id: question.id,
      body: question.text,
    };
  }

  static mapPlayerToView(participant: Participant): PlayerProgressViewModel {
    return {
      score: participant.score,
      answers: participant.answers.map(this.mapAnswersToView),
      player: {
        id: participant.user.id,
        login: participant.user.login,
      },
    };
  }

  static mapToView(question: Question): QuestionViewModel {
    return {
      id: question.id,
      body: question.text,
      correctAnswers: question.answers,
      published: question.published,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt ?? null,
    };
  }

  static mapListToView(questions: Question[]): QuestionViewModel[] {
    return questions.map(this.mapToView);
  }

  static mapGameToView(game: Game): GameViewModel {
    const [firstPlayer, secondPlayer] = game.participants;

    return {
      id: game.id,
      status: game.status,
      startGameDate: game.startedAt,
      finishGameDate: game.finishedAt,
      pairCreatedDate: game.createdAt,
      firstPlayerProgress: GameMapManager.mapPlayerToView(firstPlayer),
      questions: secondPlayer ? game.questions.map(GameMapManager.mapQuestionsToView) : null,
      secondPlayerProgress: secondPlayer ? GameMapManager.mapPlayerToView(secondPlayer) : null,
    };
  }
}
