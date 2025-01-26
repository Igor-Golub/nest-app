import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from '../domain/postComment.entity';

interface CreatePostCommentDto {
  postId: string;
  content: string;
  authorId: string;
}

@Injectable()
export class PostsCommentsRepo {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
  ) {}

  public async create(createPostCommentDto: CreatePostCommentDto) {
    const { identifiers } = await this.postCommentRepository
      .createQueryBuilder()
      .insert()
      .into(PostComment)
      .values(createPostCommentDto)
      .execute();

    return { commentId: identifiers[0].id as string };
  }

  public async updateField<Key extends keyof Base.DTOFromEntity<PostComment>>(
    id: string,
    field: Key,
    value: Base.DTOFromEntity<PostComment>[Key],
  ) {
    const { affected } = await this.postCommentRepository.update(id, {
      [field]: value,
    });

    return !!affected;
  }

  public async delete(id: string) {
    const { affected } = await this.postCommentRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    return !!affected;
  }
}
