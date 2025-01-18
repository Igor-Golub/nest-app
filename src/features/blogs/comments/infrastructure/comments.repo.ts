import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from '../domain/postComment.entity';

interface CreatePostCommentDto {
  postId: string;
  content: string;
  userId: string;
  userLogin: string;
}

@Injectable()
export class PostsCommentsRepo {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
  ) {}

  public async create(createPostCommentDto: CreatePostCommentDto) {
    return this.postCommentRepository.create(createPostCommentDto);
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
