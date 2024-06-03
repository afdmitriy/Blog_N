import { Injectable } from "@nestjs/common";
import { BlogRepository } from "../infrastructure/blog.repository";
import { Blog } from "../domain/entities/blog.mongoose.entity";
import { BlogOutputModel } from "../api/models/output/blog.output.models";
import { BlogInputModel } from "../api/models/input/blog.input";
import { ResultStatus} from "src/base/models/enums/enums";
import { ResultObjectModel } from "src/base/models/result.object.type";


@Injectable()
export class BlogService {
   constructor(protected blogRepository: BlogRepository
   ) { }

   async createBlog(blogData: BlogInputModel): Promise<ResultObjectModel<BlogOutputModel>> {
      const newBlog = new Blog(blogData);
     
      const res = await this.blogRepository.addBlog(newBlog);
      if (!res) return {
         data: null,
         errorMessage: 'Error while create blog in DB',
         status: ResultStatus.SERVER_ERROR
      }
      console.log(res)
      return {
         data: Blog.toDto(res),
         status: ResultStatus.SUCCESS
      }
   }

   async updateBlog(blogId: string, newData: BlogInputModel): Promise<boolean | null> {

      const targetBlog = await this.blogRepository.getBlogById(blogId);

      if (!targetBlog) return null;

      targetBlog.updateBlog(newData);
      // targetBlog.save()   или
      await this.blogRepository.saveBlog(targetBlog);
      
      return true;
   }

   async deleteBlog(blogId: string): Promise<ResultObjectModel<BlogOutputModel> | null> {
      const blog = await this.blogRepository.getBlogById(blogId)
      if(!blog) return null
      
      const result = this.blogRepository.deleteBlog(blogId);
      if (!result) return {
			data: null,
			errorMessage: 'Error while delete blog in DB',
			status: ResultStatus.SERVER_ERROR,
		}
		return {
			data: null,
			status: ResultStatus.SUCCESS
		}
   }
}