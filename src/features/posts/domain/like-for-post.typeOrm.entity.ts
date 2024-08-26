import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseTypeORMEntity } from "../../../base/entities/base.entity";
import { LikeStatusEnum } from "../../../base/models/enums/enums";
import { Post_Orm } from "./post.typOrm.entity";
import { User_Orm } from "../../users/domain/user.typeOrm.entity";
import { LikeForPostCreateModel } from "../api/models/input/like.post.input.model";


@Entity()
export class LikeForPost_Orm extends BaseTypeORMEntity {

   @Column({ type: 'enum', enum: LikeStatusEnum })
   likeStatus: LikeStatusEnum;

   @Column()
   userId: string

   @Column()
   postId: string

   @ManyToOne(() => Post_Orm, (p) => p.likes, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'postId' })
   post: Post_Orm;

   @ManyToOne(() => User_Orm, (u) => u.postLikes, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'userId' })
   user: User_Orm;

   static createLikeModel(likeForPost: LikeForPostCreateModel): LikeForPost_Orm {
      const likeStatus = new this()
      likeStatus.likeStatus = likeForPost.likeStatus;
      likeStatus.userId = likeForPost.userId;
      likeStatus.postId = likeForPost.postId;

      return likeStatus
   }

   updateLikeStatus(likeStatus: LikeStatusEnum) {
      this.likeStatus = likeStatus
   }

}