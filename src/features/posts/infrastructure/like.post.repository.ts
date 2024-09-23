import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LikeForPost_Orm } from "../domain/like-for-post.typeOrm.entity";


@Injectable()
export class LikePostRepository {
   constructor(@InjectRepository(LikeForPost_Orm) protected likePostRepository: Repository<LikeForPost_Orm>) { }

   async findLikeByPostIdAndUserId(postId: string, userId: string): Promise<LikeForPost_Orm | null> {
      return await this.likePostRepository.findOne({ where: { postId, userId } })
   }

   async deleteById(id: string): Promise<void> {
      await this.likePostRepository.softDelete(id)
   }

   async save(like: LikeForPost_Orm): Promise<LikeForPost_Orm> {
      return this.likePostRepository.save(like)
   }
}