import { LikeStatusEnum } from "../enums/enums"

export interface LikesInfoModel {
   likesCount: number
   dislikesCount: number
   myStatus: LikeStatusEnum
}