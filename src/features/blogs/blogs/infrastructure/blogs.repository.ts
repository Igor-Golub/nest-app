import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../domain/blog.entity';

interface CreateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
}

interface UpdateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly repository: Repository<Blog>,
  ) {}

  public async create(createBlogDto: CreateBlogDto) {
    const newBlog = this.repository.create(createBlogDto);
    return this.repository.save(newBlog);
  }

  public async update(id: string, updateBlogDto: UpdateBlogDto) {
    await this.repository.update(id, updateBlogDto);
    return await this.repository.findOneBy({ id });
  }

  public async delete(id: string) {
    const { affected } = await this.repository.delete({ id });

    return !!affected;
  }

  public async drop() {
    await this.repository.deleteAll();
  }
}
