import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/createBlogDto';
import { UpdateBlogDto } from './dto/updateBlogDto';
import { InjectModel } from '@nestjs/mongoose';
import { BlogDocument, BlogModel } from './domain/blogEntity';

@Injectable()
export class BlogsRepo {
  constructor(
    @InjectModel(BlogModel.name)
    private readonly blogModel: Model<BlogDocument>,
  ) {}

  public async findById(id: string) {
    return this.blogModel.findById(id);
  }

  public async create(createBlogDto: CreateBlogDto) {
    return this.blogModel.create(createBlogDto);
  }

  public async update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.blogModel.findByIdAndUpdate(id, updateBlogDto);
  }

  public async delete(id: string) {
    return this.blogModel.findByIdAndDelete(id);
  }
}
