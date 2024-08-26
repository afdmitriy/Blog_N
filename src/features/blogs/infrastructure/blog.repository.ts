import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blog_Orm } from "../domain/entities/blog.typeOrm.entity";

@Injectable()
export class BlogRepository {
   constructor(@InjectRepository(Blog_Orm) protected blogRepository: Repository<Blog_Orm>) { }

   async getById(id: string): Promise<Blog_Orm | null> {
      const blog = await this.blogRepository.findOne({ where: { id } });
      return blog || null;
   }

   async deleteById(id: string): Promise<void> {
      await this.blogRepository.softDelete(id)
   }

   async save(blog: Blog_Orm): Promise<Blog_Orm> {
      return this.blogRepository.save(blog)
   }
}