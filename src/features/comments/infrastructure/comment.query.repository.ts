import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument } from "../domain/comment.mongoose.entity";
import { CommentOutputModel } from "../api/models/output/comment.output.model";
import { PaginationWithItems } from "../../../base/models/pagination";
import { QuerySortModel } from "../../../base/models/input/input.models";

@Injectable()
export class CommentQueryRepository {
   constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) { }
   async getCommentById(
      id: string
   ): Promise<CommentOutputModel | null | false> {
      try {
         const comment = await this.commentModel.findOne({
            _id: id,
         });

         if (!comment) {
            return null;
         }
         return comment.toDto();
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   async getCommentsByPostId(
      postId: string,
      sortData: QuerySortModel
   ): Promise<PaginationWithItems<CommentOutputModel> | null> {
      const { sortDirection, sortBy, pageNumber, pageSize } = sortData;

      const comments = await this.commentModel
         .find({ postId: postId })
         .sort({ [sortBy]: sortDirection })
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize)

      const totalCount = await this.commentModel.countDocuments({
         postId: postId,
      });
      const commentsDto = comments.map(item => {
         return item.toDto()
      })
      return new PaginationWithItems(pageNumber, pageSize, totalCount, commentsDto)
   }

}