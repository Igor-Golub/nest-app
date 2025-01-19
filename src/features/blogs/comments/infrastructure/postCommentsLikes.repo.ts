import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../../../../common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from '../../posts/domain/postLikes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsCommentsLikesRepo {
  constructor(
    @InjectRepository(PostLike)
    private readonly postCommentLikeModel: Repository<PostLike>,
  ) {}

  public async create(dto: {
    commentId: string;
    userId: string;
    userLogin: string;
    status: LikeStatus;
  }) {
    return this.postCommentLikeModel.create(dto);
  }

  public async updateStatus(likeId: string, nextStatus: LikeStatus) {
    return this.postCommentLikeModel.update(likeId, {
      status: nextStatus,
    });
  }
}
