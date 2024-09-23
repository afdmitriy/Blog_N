import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment_Orm } from "../domain/comment.typeOrm.entity";


@Injectable()
export class CommentRepository {
   constructor(@InjectRepository(Comment_Orm) protected commentRepository: Repository<Comment_Orm>) { }

   async getById(id: string): Promise<Comment_Orm | null> {
      const comment = await this.commentRepository.findOne({ where: { id } });
      return comment || null;
   }

   async deleteById(id: string): Promise<void> {
      await this.commentRepository.softDelete(id)
   }

   async save(comment: Comment_Orm): Promise<Comment_Orm> {
      return this.commentRepository.save(comment)
   }
}