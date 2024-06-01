import { SchemaTimestampsConfig } from 'mongoose';

export declare global {
  namespace DBModels {
    type MongoResponseEntity<Entity> = WithId<Entity>;

    type MongoTimestamps = SchemaTimestampsConfig;

    interface Blog {
      name: string;
      description: string;
      websiteUrl: string;
      isMembership: boolean;
    }

    interface Post {
      title: string;
      shortDescription: string;
      content: string;
      blogId: string;
    }

    interface User {
      login: string;
      email: string;
      hash: string;
      confirmation: {
        isConfirmed: boolean;
        code: string;
        expirationDate: Date;
      };
    }

    interface Comment {
      postId: string;
      content: string;
      commentatorInfo: {
        userId: string;
        userLogin: string;
      };
    }

    interface CommentsLikes extends MongoTimestamps {
      userId: string;
      commentId: string;
      status: LikeStatus;
    }

    interface PostsLikes extends MongoTimestamps {
      userId: string;
      login: string;
      postId: string;
      status: LikeStatus;
    }
  }
}
