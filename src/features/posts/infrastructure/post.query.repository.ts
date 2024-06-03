import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PaginationWithItems } from "src/base/models/pagination"; 
import { POST_MODEL_NAME } from "./post.constants";
import { PostDocument } from "../domain/post.mongoose.entity";
import { PostOutputModel } from "../api/models/output/post.output.models";
import { QuerySortModel } from "src/base/models/input/input.models"; 
import { postMapper } from "src/infrastructure/utils/DB-mappers/post-mapper";


@Injectable()
export class PostQueryRepository {
   constructor(@InjectModel(POST_MODEL_NAME) private PostModel: Model<PostDocument>) { }
   async getAllPosts(
      sortData: QuerySortModel
   ): Promise<PaginationWithItems<PostOutputModel> | false> {
      const {
         sortDirection,
         sortBy,
         pageNumber,
         pageSize,
      } = sortData;


      try {
         const posts = await this.PostModel
            .find({})
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()
            .exec()


         const totalCount = await this.PostModel.countDocuments({});
         const allDtoPosts: PostOutputModel[] = posts.map(postMapper)


         return new PaginationWithItems(sortData.pageNumber, sortData.pageSize, totalCount, allDtoPosts);
      } catch (error) {
         console.log(error);
         return false;
      }
   }
   async getPostById(id: string): Promise<PostOutputModel | null> {
      try {
         const post = await this.PostModel.findById(id);
         if (!post) return null;
         return postMapper(post);
      } catch (error) {
         console.log(error);
         return null;
      }
   }

   async findPostsByBlogIdWithQuery(
      id: string,
      sortData: QuerySortModel
   ): Promise<PaginationWithItems<PostOutputModel>> {

      const { sortDirection, sortBy, pageNumber, pageSize } = sortData;

      // let filter = { blogId: id };

      const posts = await this.PostModel
         .find({ blogId: id })
         .sort({ [sortBy]: sortDirection })
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize)
         .lean()
         .exec()

      const totalCount = await this.PostModel.countDocuments({ blogId: id });

      const allDtoPosts: PostOutputModel[] = posts.map(postMapper)
      console.log(allDtoPosts)


      return new PaginationWithItems(sortData.pageNumber, sortData.pageSize, totalCount, allDtoPosts);
   }
}