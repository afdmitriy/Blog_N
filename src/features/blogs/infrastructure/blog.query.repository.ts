import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Blog_Orm } from "../domain/entities/blog.typeOrm.entity";
import { QueryPaginationResult } from "../../../infrastructure/types/query-sort.type";
import { PaginationWithItems } from "../../../base/models/pagination";
import { BlogOutputModel } from "../api/models/output/blog.output.models";

@Injectable()
export class BlogQueryRepository {
   constructor(@InjectRepository(Blog_Orm) protected blogRepository: Repository<Blog_Orm>) { }

   async getById(id: string): Promise<BlogOutputModel| null> {
      const blog = await this.blogRepository.findOne({ where: { id } });
      if (!blog) return null
      return this.blogMapper(blog);
   }

   async getAll(sortData: QueryPaginationResult): Promise<PaginationWithItems<BlogOutputModel>> {
      const skip = (sortData.pageNumber - 1) * sortData.pageSize;
      const serachNameTerm = sortData.searchNameTerm ?? '';
      const blogs = await this.blogRepository
         .createQueryBuilder('blog')
         .where([
            { name: ILike(`%${serachNameTerm}%`) },

         ])
         .orderBy(`blog.${sortData.sortBy}`, `${sortData.sortDirection}`)
         .take(sortData.pageSize)
         .skip(skip)
         .getMany();

      const totalCount = await this.blogRepository
         .createQueryBuilder('blog')
         .where([
            { name: ILike(`%${serachNameTerm}%`) },
         ])
         .getCount();

      const blogsDto: BlogOutputModel[] = blogs.map((blog) => this.blogMapper(blog));

      const blogsOutput: PaginationWithItems<BlogOutputModel> = new PaginationWithItems(
         sortData.pageNumber,
         sortData.pageSize,
         totalCount,
         blogsDto,
      );
      return blogsOutput;
   }

   private blogMapper(blog: Blog_Orm): BlogOutputModel {
      return {
         id: blog.id,
         name: blog.name,
         description: blog.description,
         websiteUrl: blog.websiteUrl,
         createdAt: blog.createdAt.toISOString(),
         isMembership: blog.isMembership
      }
   }
}