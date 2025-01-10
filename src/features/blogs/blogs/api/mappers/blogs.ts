import { BlogViewModel } from '../models/output';
import type { Blog } from '../../domain/blog.entity';

export class BlogsViewMapperManager {
  static mapBlogsToViewModel(dbModel: Blog): BlogViewModel {
    return {
      id: dbModel.id,
      name: dbModel.name,
      websiteUrl: dbModel.websiteUrl,
      description: dbModel.description,
      isMembership: dbModel.isMembership,
      createdAt: dbModel.createdAt.toISOString(),
    };
  }
}
