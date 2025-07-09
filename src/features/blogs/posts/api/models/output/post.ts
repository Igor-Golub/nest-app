import { Field, ObjectType } from '@nestjs/graphql';
import { LikeStatus } from '../../../../../../common/enums';

interface Like {
  addedAt: string;
  userId: string;
  login: string;
}

interface LikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: Like[];
}

export interface PostViewModelWithLikes {
  id: string;
  title: string;
  blogId: string;
  content: string;
  blogName: string;
  createdAt: string;
  shortDescription: string;
  extendedLikesInfo: LikesInfo;
}

@ObjectType()
export class PostViewModel {
  @Field({
    description: 'Unique identifier (UUID) of the post',
  })
  id: string;

  @Field({
    description: 'The display title of the post',
  })
  title: string;
}
