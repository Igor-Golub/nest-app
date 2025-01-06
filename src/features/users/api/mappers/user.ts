import { UserViewModel } from '../models/output';
import { User } from '../../domain/user.entity';

export class UserViewMapperManager {
  static mapUsersToView(userDbModel: User): UserViewModel {
    return {
      id: userDbModel.id,
    };
  }
}
