import { AnswerStatus } from '../../../infrastructure/enums';
import { Answer, Game, type Participant, Question } from '../../../domain';
import {
  AnswerViewModel,
  GameQuestionViewModel,
  GameViewModel,
  PlayerProgressViewModel,
  QuestionViewModel,
} from '../output';

export class GameMapManager {
  static mapAnswersToView(answers: Answer): AnswerViewModel {
    return {
      addedAt: answers.createdAt,
      questionId: answers.question.id,
      answerStatus: answers.status,
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
      score: participant.answers.reduce((score, { status }) => (score += status === AnswerStatus.Correct ? 1 : 0), 0),
      answers: participant.answers.map(this.mapAnswersToView),
      player: {
        id: participant.id,
        login: participant.user.login,
      },
    };
  }

  static mapToView(question: Question): QuestionViewModel {
    return {
      body: question.text,
      correctAnswers: question.answers,
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
      pairCreatedDate: game.startedAt,
      firstPlayerProgress: this.mapPlayerToView(firstPlayer),
      questions: secondPlayer ? game.questions.map(this.mapQuestionsToView) : null,
      secondPlayerProgress: secondPlayer ? this.mapPlayerToView(secondPlayer) : null,
    };
  }
}
