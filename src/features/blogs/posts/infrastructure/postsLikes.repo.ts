import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../../../../common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from '../domain/postLikes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsLikesRepo {
  constructor(
    @InjectRepository(PostLike)
    private readonly repository: Repository<PostLike>,
  ) {}

  public async findLikeByUserIdAndPostId(userId: string, postId: string) {
    return this.repository.findOne({ where: { userId, postId } });
  }

  public async create(
    userId: string,
    userLogin: string,
    postId: string,
    status: LikeStatus,
  ) {
    return this.repository.create({
      postId,
      userLogin,
      status,
      userId,
    });
  }

  public async updateStatus(likeId: string, likeStatus: LikeStatus) {
    return this.repository.update(likeId, {
      status: likeStatus,
    });
  }
}
