import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentLike } from '../domain/commentLike.entity';

@Injectable()
export class PostsCommentsLikesQueryRepository {
  constructor(
    @InjectRepository(CommentLike) private repository: Repository<CommentLike>,
  ) {}

  public async findLikeByUserIdAndCommentId(userId: string, commentId: string) {
    return this.repository
      .createQueryBuilder()
      .where('commentId = :id and ownerId = :ownerId', {
        commentId,
        ownerId: userId,
      })
      .getOne();
  }
}
