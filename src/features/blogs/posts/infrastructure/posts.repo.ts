import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';

interface CreatePostDto {
  title: string;
  blogId: string;
  content: string;
  authorId: string;
  shortDescription: string;
}

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    const { identifiers } = await this.repository
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values(createPostDto)
      .execute();

    return { id: identifiers[0].id as string };
  }

  public async update(
    id: string,
    updatePostDto: Omit<Base.DTOFromEntity<Post>, 'blogName'>,
  ) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(Post)
      .where('p.id = :id', { id })
      .set(updatePostDto)
      .execute();

    return !!affected;
  }

  public async delete(id: string) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Post, 'p')
      .where('p.id = :id', { id })
      .execute();

    return !!affected;
  }
}
