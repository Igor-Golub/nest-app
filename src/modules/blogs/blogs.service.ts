import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/createBlogDto';
import { UpdateBlogDto } from './dto/updateBlogDto';

@Injectable()
export class BlogsService {
  private readonly blogs: { id: string }[] = [];

  public async findById(id: string) {
    return this.blogs.find((i) => i.id === id);
  }

  public async create(createBlogDto: CreateBlogDto) {
    const newBlog = {
      ...createBlogDto,
      id: Date.now().toString(),
    };

    this.blogs.push(newBlog);

    return newBlog;
  }

  public async update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.blogs.map((i) =>
      i.id === id
        ? {
            id: id,
            updateBlogDto,
          }
        : i,
    );
  }

  public async delete(id: string) {
    this.blogs.filter((i) => i.id !== id);

    return true;
  }
}
