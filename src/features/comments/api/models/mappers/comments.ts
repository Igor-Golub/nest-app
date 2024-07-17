import { LikeStatus } from '../../../../../common/enums';

export class CommentsViewMapperManager {
  static commentToViewModel(dbModel) {
    return {
      id: dbModel._id.toString(),
      content: dbModel.content,
      dbModelatorInfo: {
        userId: dbModel.userId,
        userLogin: dbModel.userLogin,
      },
      createdAt: dbModel._id._id.getTimestamp(),
      likesInfo: {
        likesCount: dbModel.likesCount,
        dislikesCount: dbModel.dislikesCount,
        myStatus: LikeStatus.None,
      },
    };
  }
}
