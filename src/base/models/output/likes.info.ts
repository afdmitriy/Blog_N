import { LikeStatusEnum } from "../enums/enums"

export interface LikesInfo {
   likesCount: number
   dislikesCount: number
   myStatus: LikeStatusEnum
}