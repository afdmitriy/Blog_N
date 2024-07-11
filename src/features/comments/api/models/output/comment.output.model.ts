import { LikesInfoModel } from "../../../../../base/models/output/likes.info"

export interface CommentOutputModel {
   id: string
   content: string
   createdAt: string
   commentatorInfo: {
      userId: string
      userLogin: string
   }

}

export interface CommentWithLikesOutputModel extends CommentOutputModel {
   likesInfo: LikesInfoModel
}
