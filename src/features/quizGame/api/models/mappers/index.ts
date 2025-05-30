import { AnswerViewModel, GameQuestionViewModel, GameViewModel, PlayerViewModel, QuestionViewModel } from '../output';
import { Answer, Game, type Participant, Question } from '../../../domain';

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

  static mapPlayerToView(participant: Participant): PlayerViewModel {
    return {
      score: 0,
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
      pairCreatedDate: game.pairCreatedAt,
      questions: game.questions.map(this.mapQuestionsToView),
      firstPlayerProgress: this.mapPlayerToView(firstPlayer),
      secondPlayerProgress: this.mapPlayerToView(secondPlayer),
    };
  }
}
