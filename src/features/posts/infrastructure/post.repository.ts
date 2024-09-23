import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post_Orm } from "../domain/post.typOrm.entity";

@Injectable()
export class PostRepository {
   constructor(@InjectRepository(Post_Orm) protected postRepository: Repository<Post_Orm>) { }

   async getById(id: string): Promise<Post_Orm | null> {
      const post = await this.postRepository.findOne({ where: { id } });
      return post || null;
   }
   
   async deleteById(id: string): Promise<void> {
      await this.postRepository.softDelete(id)
   }

   async save(post: Post_Orm): Promise<Post_Orm> {
      return this.postRepository.save(post)
   }
}