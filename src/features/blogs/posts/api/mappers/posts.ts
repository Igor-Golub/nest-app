import { LikeStatus } from '../../../../../common/enums';

export class PostsViewMapperManager {
  static addDefaultLikesData(post) {
    const {
      _id,
      title,
      blogId,
      content,
      blogName,
      createdAt,
      shortDescription,
    } = post;

    return {
      id: _id.toString(),
      title,
      blogId,
      content,
      blogName,
      createdAt,
      shortDescription,
      extendedLikesInfo: {
        myStatus: LikeStatus.None,
        likesCount: 0,
        dislikesCount: 0,
        newestLikes: [],
      },
    };
  }

  static mapPostsToViewModelWithLikes(
    posts,
    postLikes,
    reqUserId: string | undefined,
  ): any {
    return posts.map(
      ({
        _id,
        content,
        blogName,
        blogId,
        createdAt,
        title,
        shortDescription,
      }) => ({
        id: _id.toString(),
        createdAt,
        content,
        blogName,
        blogId,
        title,
        shortDescription,
        extendedLikesInfo: postLikes.reduce(
          (acc, { status, userId, createdAt, postId, userLogin }) => {
            if (_id.toString() !== postId) return acc;

            if (status === LikeStatus.Like) acc.likesCount += 1;
            if (status === LikeStatus.Dislike) acc.dislikesCount += 1;
            if (reqUserId && reqUserId === userId) acc.myStatus = status;

            if (status === LikeStatus.Like && acc.newestLikes.length < 3) {
              acc.newestLikes.push({
                addedAt: new Date(createdAt!.toString()).toISOString(),
                userId,
                login: userLogin,
              });
            }

            return acc;
          },
          {
            likesCount: 0,
            dislikesCount: 0,
            newestLikes: [],
            myStatus: LikeStatus.None,
          },
        ),
      }),
    );
  }
}
