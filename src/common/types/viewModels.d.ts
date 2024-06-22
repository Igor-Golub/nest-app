export declare global {
  namespace ViewModels {
    interface BaseModel {
      id: string;
      createdAt: string;
    }

    interface Blog extends BaseModel {
      name: string;
      description: string;
      websiteUrl: string;
      isMembership: boolean;
    }

    interface Post extends BaseModel {
      title: string;
      shortDescription: string;
      content: string;
      blogId: string;
      blogName: string;
    }

    interface PostWithLikes extends Post {
      likesInfo: LikesInfo;
    }

    interface PostWithFullLikes extends Post {
      extendedLikesInfo: ExtendedLikesInfo;
    }

    interface User extends BaseModel {
      login: string;
      email: string;
    }

    interface UserAccountInfo {
      userId: string;
      login: string;
      email: string;
    }

    interface Comment extends BaseModel {
      content: string;
      commentatorInfo: CommentatorInfo;
      likesInfo: LikesInfo;
    }
  }
}
