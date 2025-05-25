import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../../../../common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentLike } from '../domain/commentLike.entity';

interface CreateDto {
  ownerId: string;
  commentId: string;
  status: LikeStatus;
}

@Injectable()
export class PostsCommentsLikesRepo {
  constructor(
    @InjectRepository(CommentLike)
    private readonly repository: Repository<CommentLike>,
  ) {}

  public async create(createDto: CreateDto) {
    return this.repository.createQueryBuilder().insert().into(CommentLike).values(createDto).execute();
  }

  public async updateStatus(likeId: string, nextStatus: LikeStatus) {
    return this.repository.update(likeId, {
      status: nextStatus,
    });
  }
}
