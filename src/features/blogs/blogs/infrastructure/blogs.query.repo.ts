import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlogModel } from '../domain/blog.entity';

@Injectable()
export class BlogsQueryRepo {
  constructor(
    @InjectModel(BlogModel.name) private readonly blogModel: Model<BlogModel>,
  ) {}

  public async getWithPagination() {
    return {
      pageSize: 0,
      items: [],
      page: 1,
      totalCount: 1,
      pagesCount: 0,
    };
  }

  public async getById(id: string) {
    return this.blogModel.findById(id);
  }
}
