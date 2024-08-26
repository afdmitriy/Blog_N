import { LikeStatusEnum } from "src/base/models/enums/enums"

export interface LikeForPostOutputModel {
   likeStatus: LikeStatusEnum
   postId: string
   userId: string
}