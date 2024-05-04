import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/createBlogDto';
import { UpdateBlogDto } from './dto/updateBlogDto';
import { BlogsRepo } from './blogs.repo';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepo: BlogsRepo) {}

  public async findById(id: string) {
    return this.blogsRepo.findById(id);
  }

  public async create(createBlogDto: CreateBlogDto) {
    return this.blogsRepo.create(createBlogDto);
  }

  public async update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.blogsRepo.update(id, updateBlogDto);
  }

  public async delete(id: string) {
    return this.blogsRepo.delete(id);
  }
}
