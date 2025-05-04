import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';

interface CreatePostDto {
  title: string;
  blogId: string;
  content: string;
  shortDescription: string;
}

interface UpdatePostDto {
  title: string;
  content: string;
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

    return identifiers[0].id as string;
  }

  public async update(id: string, updatePostDto: UpdatePostDto) {
    await this.repository.update({ id }, updatePostDto);
    return await this.repository.findOneBy({ id });
  }

  public async delete(id: string) {
    const { affected } = await this.repository.delete({ id });

    return !!affected;
  }
}
