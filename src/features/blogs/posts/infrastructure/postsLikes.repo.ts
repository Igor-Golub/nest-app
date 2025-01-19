import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from '../domain/postLikes.entity';
import { LikeStatus } from '../../../../common/enums';

@Injectable()
export class PostsLikesRepo {
  constructor(
    @InjectRepository(PostLike)
    private readonly repository: Repository<PostLike>,
  ) {}

  public async findLikeByUserIdAndPostId(userId: string, postId: string) {
    return this.repository.findOne({ where: { ownerId: userId, postId } });
  }

  public async create(userId: string, postId: string, status: LikeStatus) {
    return this.repository.create({
      postId,
      ownerId: userId,
      status,
    });
  }

  public async updateStatus(likeId: string, likeStatus: LikeStatus) {
    return this.repository.update(likeId, {
      status: likeStatus,
    });
  }
}
