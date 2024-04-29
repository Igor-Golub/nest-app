export declare global {
  namespace ApiDTO {
    interface BlogCreateAndUpdate {
      name: string;
      description: string;
      websiteUrl: string;
      isMembership: boolean;
    }

    interface PostCreateAndUpdate {
      title: string;
      shortDescription: string;
      content: string;
      blogId: string;
    }

    interface UserCreate {
      login: string;
      password: string;
      email: string;
    }

    interface CommentCreateAndUpdate {
      content: string;
    }
  }
}
