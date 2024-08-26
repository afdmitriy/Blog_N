// import { Injectable } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import { Model } from "mongoose";
// import { POST_MODEL_NAME } from "./post.constants";
// import { PostDocument } from "../domain/post.mongoose.entity";
// import { PostOutputModel } from "../api/models/output/post.output.models";
// import { QuerySortModel } from "../../../base/models/input/input.models";
// import { PaginationWithItems } from "../../../base/models/pagination";
// import { postMapper } from "../../../infrastructure/utils/mappers/post-mapper";



// @Injectable()
// export class PostQueryRepository {
//    constructor(@InjectModel(POST_MODEL_NAME) private PostModel: Model<PostDocument>) { }
//    async getAllPosts(
//       sortData: QuerySortModel
//    ): Promise<PaginationWithItems<PostOutputModel> | false> {
//       const {
//          sortDirection,
//          sortBy,
//          pageNumber,
//          pageSize,
//       } = sortData;


//       try {
//          const posts = await this.PostModel
//             .find({})
//             .sort({ [sortBy]: sortDirection })
//             .skip((pageNumber - 1) * pageSize)
//             .limit(pageSize)
//             .lean()
//             .exec()


//          const totalCount = await this.PostModel.countDocuments({});
//          const allDtoPosts: PostOutputModel[] = posts.map(postMapper)


//          return new PaginationWithItems(sortData.pageNumber, sortData.pageSize, totalCount, allDtoPosts);
//       } catch (error) {
//          console.log(error);
//          return false;
//       }
//    }
//    async getPostById(id: string): Promise<PostOutputModel | null> {
//       try {
//          const post = await this.PostModel.findById(id);
//          if (!post) return null;
//          return postMapper(post);
//       } catch (error) {
//          console.log(error);
//          return null;
//       }
//    }

//    async findPostsByBlogIdWithQuery(
//       blogId: string,
//       sortData: QuerySortModel
//    ): Promise<PaginationWithItems<PostOutputModel>> {

//       const { sortDirection, sortBy, pageNumber, pageSize } = sortData;

//       // let filter = { blogId: id };

//       const posts = await this.PostModel
//          .find({ blogId: blogId })
//          .sort({ [sortBy]: sortDirection })
//          .skip((pageNumber - 1) * pageSize)
//          .limit(pageSize)
//          .lean()
//          .exec()

//       const totalCount = await this.PostModel.countDocuments({ blogId: blogId });

//       const allDtoPosts: PostOutputModel[] = posts.map(postMapper)

//       return new PaginationWithItems(sortData.pageNumber, sortData.pageSize, totalCount, allDtoPosts);
//    }
// }