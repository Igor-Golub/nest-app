import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../domain/blog.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  public async findById(id: string) {
    return this.blogRepository
      .createQueryBuilder()
      .select()
      .where('id = :id', { id })
      .getOne();
  }

  public async create(createBlogDto: any) {
    const { identifiers } = await this.blogRepository
      .createQueryBuilder()
      .insert()
      .values(createBlogDto)
      .into(Blog)
      .execute();

    return { id: identifiers[0].id as string };
  }

  public async update(id: string, updateBlogDto: any) {
    const { affected } = await this.blogRepository
      .createQueryBuilder()
      .update(Blog)
      .set(updateBlogDto)
      .where('id = :id', { id })
      .execute();

    return !!affected;
  }

  public async delete(id: string) {
    const { affected } = await this.blogRepository.delete({
      id,
    });

    return !!affected;
  }
}
