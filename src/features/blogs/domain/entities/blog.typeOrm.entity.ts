import { Column, Entity, OneToMany } from "typeorm";
import { BaseTypeORMEntity } from "../../../../base/entities/base.entity";
import { Post_Orm } from "../../../posts/domain/post.typOrm.entity";
import { BlogInputModel } from "../../api/models/input/blog.input";

@Entity()
export class Blog_Orm extends BaseTypeORMEntity {

   @Column({ collation: 'C' })
   name: string;

   @Column()
   description: string;

   @Column()
   websiteUrl: string

   @Column({ default: false })
   isMembership: boolean;

   @OneToMany(() => Post_Orm, (p) => p.blog)
   posts: Post_Orm[];


   static createBlogModel(newBlog: BlogInputModel): Blog_Orm {
      const blog = new this();
      blog.name = newBlog.name
      blog.description = newBlog.description
      blog.websiteUrl = newBlog.websiteUrl

      return blog;
   }

   updateBlog(params: BlogInputModel): void {
		this.name = params.name;
		this.description = params.description;
		this.websiteUrl = params.websiteUrl;
      
	}

}