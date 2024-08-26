import { LikesInfoModel } from "src/base/models/output/likes.info"

export interface LikesInfoForPost extends LikesInfoModel {
   newestLikes: newestLikes[]
}

export interface newestLikes {
   addedAt: string
   userId: string
   login: string
}

