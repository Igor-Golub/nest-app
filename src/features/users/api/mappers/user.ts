import { UserDBEntity } from '../../domain/userEntity';
import { UserViewModel } from '../models/output';

export class UserViewMapperManager {
  static mapUsersToView(dbModel: UserDBEntity): UserViewModel | null {
    return null;
  }
}
