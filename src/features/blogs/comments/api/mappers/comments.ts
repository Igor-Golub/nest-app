import { LikeStatus } from '../../../../../common/enums';

export class CommentsViewMapperManager {
  static commentWithoutLikesToViewModel(dbModel) {
    return {
      id: dbModel._id.toString(),
      content: dbModel.content,
      commentatorInfo: {
        userId: dbModel.userId,
        userLogin: dbModel.userLogin,
      },
      createdAt: dbModel._id._id.getTimestamp(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
      },
    };
  }

  static commentWithLikeToViewModel(
    comment,
    commentsLikes,
    reqUserId: string | undefined,
  ): any {
    const { _id, content, userId, userLogin } = comment;

    return {
      id: _id.toString(),
      createdAt: _id.getTimestamp().toISOString(),
      content,
      commentatorInfo: { userId, userLogin },
      likesInfo: commentsLikes
        .filter(({ commentId }) => commentId === _id.toString())
        .reduce(
          (acc, { status, userId }) => {
            if (status === LikeStatus.Like) acc.likesCount += 1;
            if (status === LikeStatus.Dislike) acc.dislikesCount += 1;
            if (reqUserId && reqUserId === userId) acc.myStatus = status;

            return acc;
          },
          {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeStatus.None,
          },
        ),
    };
  }
}
