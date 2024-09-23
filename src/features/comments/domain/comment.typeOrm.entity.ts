import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseTypeORMEntity } from "../../../base/entities/base.entity";
import { Post_Orm } from "../../posts/domain/post.typOrm.entity";
import { User_Orm } from "../../users/domain/user.typeOrm.entity";
import { LikeForComment_Orm } from "./like-for-comment.typeOrm.entity";
import { CommentCreateModel } from "../api/models/input/comment.input.models";


@Entity()
export class Comment_Orm extends BaseTypeORMEntity {

   @Column({ collation: 'C' })
   content: string;

   @Column({ type: 'uuid' })
   postId: string

   @Column({ type: 'uuid' })
   userId: string

   @ManyToOne(() => Post_Orm, (p) => p.comments, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'postId' })
   post: Post_Orm;

   @OneToMany(() => LikeForComment_Orm, (l) => l.comment)
   likes: LikeForComment_Orm[];

   @ManyToOne(() => User_Orm, (u) => u.postLikes, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'userId' })
   user: User_Orm;

   static createCommentModel(commentInput: CommentCreateModel): Comment_Orm {
      const comment = new this()
		comment.content = commentInput.content;
		comment.postId = commentInput.postId;
		comment.userId = commentInput.userId;
		return comment
   }

   updateComment(content: string): void {
		this.content = content;
	}

}