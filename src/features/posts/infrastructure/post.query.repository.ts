import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post_Orm } from "../domain/post.typOrm.entity";

@Injectable()
export class PostQueryRepository {
   constructor(@InjectRepository(Post_Orm) protected postRepository: Repository<Post_Orm>) { }

   async getById(id: string): Promise<Post_Orm | null> {
      const post = await this.postRepository.findOne({ where: { id } });
      return post || null;
   }

   
}