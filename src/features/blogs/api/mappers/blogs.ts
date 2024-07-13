import { BlogViewModel } from '../models/output';

export function mapBlogsToViewModel(dbModel): BlogViewModel {
  return {
    id: dbModel._id.toString(),
    createdAt: dbModel._id.getTimestamp().toISOString(),
    name: dbModel.name,
    isMembership: dbModel.isMembership,
    websiteUrl: dbModel.websiteUrl,
    description: dbModel.description,
  };
}
