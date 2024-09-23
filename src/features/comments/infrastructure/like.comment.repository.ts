import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LikeForComment_Orm } from "../domain/like-for-comment.typeOrm.entity";



@Injectable()
export class LikeCommentRepository {
   constructor(@InjectRepository(LikeForComment_Orm) protected likeCommentRepository: Repository<LikeForComment_Orm>) { }

   async findLikeByCommentIdAndUserId(commentId: string, userId: string): Promise<LikeForComment_Orm | null> {
      return await this.likeCommentRepository.findOne({ where: { commentId, userId } })
   }

   async deleteById(id: string): Promise<void> {
      await this.likeCommentRepository.softDelete(id)
   }

   async save(like: LikeForComment_Orm): Promise<LikeForComment_Orm> {
      return this.likeCommentRepository.save(like)
   }
}