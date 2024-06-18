import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { BLOG_MODEL_NAME } from "./blog.constants";
import { Blog, BlogDocument } from "../domain/entities/blog.mongoose.entity";
import { BlogSortModel } from "../api/models/input/blog.input";
import { BlogOutputModel } from "../api/models/output/blog.output.models";
import { PaginationWithItems } from "../../../base/models/pagination";
import { blogMapper } from "../../../infrastructure/utils/DB-mappers/blog-mapper";


@Injectable()
export class BlogQueryRepository {
   constructor(@InjectModel(BLOG_MODEL_NAME) private blogModel: Model<BlogDocument>) { }
   async getAllBlogs(
      sortData: BlogSortModel
   ): Promise<PaginationWithItems<BlogOutputModel> | false> {
      const {
         sortDirection,
         sortBy,
         pageNumber,
         pageSize,
         searchNameTerm,
      } = sortData;

      const filter: FilterQuery<Blog> = {};

      if (searchNameTerm) {
         filter.name = {
            $regex: searchNameTerm,
            $options: 'i',
         }
      }


      try {
         const blogs = await this.blogModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)


         const totalCount = await this.blogModel.countDocuments(filter);
         const allDtoBlogs: BlogOutputModel[] = blogs.map(blogMapper)


         return new PaginationWithItems(sortData.pageNumber, sortData.pageSize, totalCount, allDtoBlogs);
      } catch (error) {
         console.log(error);
         return false;
      }
   }
   async getBlogById(id: string): Promise<BlogOutputModel | null> {
      try {
         const blog = await this.blogModel.findById(id);
         if (!blog) return null;
         return blogMapper(blog);
      } catch (error) {
         console.log(error);
         return null;
      }
   }
}