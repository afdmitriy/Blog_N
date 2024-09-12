import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseTypeORMEntity } from "../../../base/entities/base.entity";
import { Blog_Orm } from "../../blogs/domain/entities/blog.typeOrm.entity";
import { PostInputModel, PostWithoutBlogInputModel } from "../api/models/input/post.input";
import { LikeForPost_Orm } from "./like-for-post.typeOrm.entity";


@Entity()
export class Post_Orm extends BaseTypeORMEntity {

   @Column({ collation: 'C' })
   title: string;

   @Column()
   shortDescription: string;

   @Column()
   content: string

   @Column({ type: 'uuid' })
   blogId: string

   @ManyToOne(() => Blog_Orm, (b) => b.posts, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'blogId' })
   blog: Blog_Orm;

   @OneToMany(() => LikeForPost_Orm, (l) => l.post)
   likes: LikeForPost_Orm[];

   static createPostModel(newPost: PostInputModel): Post_Orm {
      const post = new this();
      post.title = newPost.title;
      post.shortDescription = newPost.shortDescription;
      post.content = newPost.content;
      post.blogId = newPost.blogId
      return post;
   }

   updatePost(params: PostWithoutBlogInputModel): void {
		this.title = params.title;
		this.shortDescription = params.shortDescription;
		this.content = params.content;
	}

}