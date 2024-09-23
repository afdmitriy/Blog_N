import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseTypeORMEntity } from "../../../base/entities/base.entity";
import { LikeStatusEnum } from "../../../base/models/enums/enums";
import { User_Orm } from "../../users/domain/user.typeOrm.entity";
import { Comment_Orm } from "./comment.typeOrm.entity";
import { LikeForCommentCreateModel } from "../api/models/input/like.comment.input.model";


@Entity()
export class LikeForComment_Orm extends BaseTypeORMEntity {

   @Column({ type: 'enum', enum: LikeStatusEnum })
   likeStatus: LikeStatusEnum;

   @Column({ type: 'uuid' })
   userId: string

   @Column({ type: 'uuid' })
   commentId: string

   @ManyToOne(() => Comment_Orm, (c) => c.likes, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'commentId' })
   comment: Comment_Orm;

   @ManyToOne(() => User_Orm, (u) => u.commentLikes, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'userId' })
   user: User_Orm;

   static createLikeModel(likeForComment: LikeForCommentCreateModel): LikeForComment_Orm {
      const like = new this()
      like.likeStatus = likeForComment.likeStatus;
      like.userId = likeForComment.userId;
      like.commentId = likeForComment.commentId;
      return like
   }

   updateLikeStatus(likeStatus: LikeStatusEnum) {
      this.likeStatus = likeStatus
   }

}