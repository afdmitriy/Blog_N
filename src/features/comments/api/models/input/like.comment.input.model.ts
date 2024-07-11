import { LikeStatusEnum } from "src/base/models/enums/enums";

export interface LikeForCommentCreateModel {
   likeStatus: LikeStatusEnum
   commentId: string
   userId: string
}