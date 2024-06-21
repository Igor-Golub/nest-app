import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogModel } from '../domain/blogEntity';
import { UpdateBlogDto } from '../api/models/input/updateBlogDto';

@Injectable()
export class BlogsRepo {
  constructor(
    @InjectModel(BlogModel.name)
    private readonly blogModel: Model<BlogModel>,
  ) {}

  public async findById(id: string) {
    return this.blogModel.findById(id);
  }

  public async create(createBlogDto: DBModels.Blog) {
    return this.blogModel.create(createBlogDto);
  }

  public async update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.blogModel.findByIdAndUpdate(id, updateBlogDto);
  }

  public async delete(id: string) {
    return this.blogModel.findByIdAndDelete(id);
  }
}
