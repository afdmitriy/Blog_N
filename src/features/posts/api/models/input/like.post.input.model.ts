import { LikeStatusEnum } from "src/base/models/enums/enums";

export interface LikeForPostCreateModel {
   likeStatus: LikeStatusEnum
   postId: string
   userId: string
}