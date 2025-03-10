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

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly repository: Repository<Blog>,
  ) {}

  public async create(createBlogDto: CreateBlogDto) {
    const { identifiers } = await this.repository
      .createQueryBuilder()
      .insert()
      .values(createBlogDto)
      .into(Blog)
      .execute();

    return { id: identifiers[0].id as string };
  }

  public async update(id: string, updateBlogDto: any) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(Blog)
      .set(updateBlogDto)
      .where('id = :id', { id })
      .execute();

    return !!affected;
  }

  public async delete(id: string) {
    const { affected } = await this.repository.delete({
      id,
    });

    return !!affected;
  }

  public async drop() {
    await this.repository.delete({});
  }
}
