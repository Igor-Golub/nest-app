import { UserDBEntity } from '../../domain/userEntity';
import { UserViewModel } from '../models/output';

export class UserViewMapperManager {
  static mapUsersToView(dbModels: UserDBEntity[]): UserViewModel[] {
    return [];
  }
}
