import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentLike } from '../domain/commentLike.entity';

@Injectable()
export class PostsCommentsLikesQueryRepository {
  constructor(
    @InjectRepository(CommentLike) private repository: Repository<CommentLike>,
  ) {}

  public async isLikeForCommentExist(commentId: string) {
    return this.repository
      .createQueryBuilder()
      .select()
      .where('commentId = :commentId', { commentId })
      .getCount();
  }

  public async findCommentsLikesByCommentId(commentId: string) {
    return this.repository
      .createQueryBuilder()
      .where('commentId = :commentId', { commentId })
      .getMany();
  }

  public async findLikeByUserIdAndCommentId(userId: string, commentId: string) {
    return this.repository
      .createQueryBuilder()
      .where('commentId = :id and ownerId = :ownerId', {
        commentId,
        ownerId: userId,
      })
      .getOne();
  }

  public async findLikesByIds(ids: string[]) {
    return this.repository
      .createQueryBuilder('like')
      .where('like.commentId IN (:...ids)', { ids })
      .getMany();
  }
}
