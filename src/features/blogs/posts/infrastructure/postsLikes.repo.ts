import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from '../domain/postLikes.entity';
import { LikeStatus } from '../../../../common/enums';

interface CreateLikeDto {
  ownerId: string;
  postId: string;
  status: LikeStatus;
}

@Injectable()
export class PostsLikesRepo {
  constructor(
    @InjectRepository(PostLike)
    private readonly repository: Repository<PostLike>,
  ) {}

  public async findLikeByUserIdAndPostId(userId: string, postId: string) {
    return this.repository.findOne({ where: { ownerId: userId, postId } });
  }

  public async create(createDto: CreateLikeDto) {
    return this.repository
      .createQueryBuilder()
      .insert()
      .into(PostLike)
      .values(createDto)
      .execute();
  }

  public async updateStatus(likeId: string, likeStatus: LikeStatus) {
    return this.repository
      .createQueryBuilder()
      .update()
      .where(`id = :id`, { id: likeId })
      .set({ status: likeStatus })
      .execute();
  }
}
