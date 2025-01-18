import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from '../domain/postComment.entity';

@Injectable()
export class CommentsQueryRepo {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
  ) {}

  public async findById(id: string) {
    return this.postCommentRepository
      .createQueryBuilder()
      .select()
      .where('id = :id', { id })
      .getOne();
  }

  public async isOwnerComment(id: string, ownerId: string) {
    return null;
  }

  public async getWithPagination() {
    return null;
  }
}
