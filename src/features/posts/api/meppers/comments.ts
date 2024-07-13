import { CommentViewModel } from '../models/output';

export function mapCommentsToViewModel(
  dbModel,
  isLoggedUser: boolean = false,
): CommentViewModel {
  return {
    id: dbModel._id.toString(),
    content: dbModel.content,
    commentatorInfo: {
      userId: dbModel.userId,
      userLogin: dbModel.userLogin,
    },
    createdAt: dbModel._id.getTimestamp().toISOString(),
    likesInfo: {
      likesCount: dbModel.likesCount,
      dislikesCount: dbModel.dislikesCount,
      myStatus: dbModel.currentLikeStatus,
    },
  };
}
