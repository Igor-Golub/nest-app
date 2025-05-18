import { QuestionViewModel } from '../output';
import { Question } from '../../../domain';

export class QuestionMapManager {
  static mapToView(question: Question): QuestionViewModel {
    return {
      body: question.text,
      correctAnswers: [],
    };
  }

  static mapListToView(questions: Question[]): QuestionViewModel[] {
    return questions.map(QuestionMapManager.mapToView);
  }
}
