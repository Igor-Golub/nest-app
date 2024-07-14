import { ProfileViewModel } from '../models/output';

export function mapProfileToView(dbModel): ProfileViewModel {
  return {
    userId: dbModel._id.toString(),
    login: dbModel.login,
    email: dbModel.email,
  };
}
