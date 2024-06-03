import { LikesInfo } from "src/base/models/output/likes.info"

export interface LikesInfoForPost extends LikesInfo {
   newestLikes: newestLikes[]
}

export interface newestLikes {
   addedAt: string
   userId: string
   login: string
}

