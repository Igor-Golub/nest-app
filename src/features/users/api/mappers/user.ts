import { UserDBEntity } from '../../domain/user.entity';
import { UserViewModel } from '../models/output';

export class UserViewMapperManager {
  static mapUsersToView(dbModel: UserDBEntity): UserViewModel | null {
    return null;
  }
}
