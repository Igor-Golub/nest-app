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
      .createQueryBuilder('cl')
      .where('cl.id = :id AND cl.ownerId = :ownerId', {
        id: commentId,
        ownerId: userId,
      })
      .getOne();
  }
}
