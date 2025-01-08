import type { ProfileViewModel } from '../models/output';
import type { User } from '../../../users/domain/user.entity';

export class AuthViewMapperManager {
  static mapProfileToView(dbModel: User): ProfileViewModel {
    return {
      userId: dbModel.id,
      login: dbModel.login,
      email: dbModel.email,
    };
  }
}
