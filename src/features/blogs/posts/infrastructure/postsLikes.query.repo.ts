import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PostLike } from '../domain/postLikes.entity';

@Injectable()
export class PostsLikesQueryRepo {
  constructor(
    @InjectRepository(PostLike)
    private readonly repository: Repository<PostLike>,
  ) {}

  public async findLikeByUserIdAndPostId(userId: string, postId: string) {
    return this.repository.findOne({
      where: { userId, postId },
    });
  }

  public async findLikesByIds(ids: string[]) {
    return this.repository.find({
      where: { postId: In(ids) },
    });
  }
}
