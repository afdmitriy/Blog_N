import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User_Orm } from "../domain/user.typeOrm.entity";
import { ILike, Repository } from "typeorm";
import { UserOutputModel } from "../api/models/output/user.output.model";
import { PaginationWithItems } from "../../../base/models/pagination";
import { QueryPaginationResult } from "../../../infrastructure/types/query-sort.type";

@Injectable()
export class UserQueryRepository {
   constructor(@InjectRepository(User_Orm) protected userRepository: Repository<User_Orm>) { }

   async getById(id: string): Promise<UserOutputModel | null> {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) return null;
      return this.userMapping(user)
   }

   async getAll(sortData: QueryPaginationResult): Promise<PaginationWithItems<UserOutputModel>> {
      const skip = (sortData.pageNumber - 1) * sortData.pageSize;
      const serachLoginTerm = sortData.searchLoginTerm ?? '';
      const searchEmailTerm = sortData.searchEmailTerm ?? '';
      const users = await this.userRepository
         .createQueryBuilder('user')
         .where([
            { login: ILike(`%${serachLoginTerm}%`) },
            { email: ILike(`%${searchEmailTerm}%`) },
         ])
         .orderBy(`user.${sortData.sortBy}`, `${sortData.sortDirection}`)
         .take(sortData.pageSize)
         .skip(skip)
         .getMany();

      const totalCount = await this.userRepository
         .createQueryBuilder('user')
         .where([
            { login: ILike(`%${serachLoginTerm}%`) },
            { email: ILike(`%${searchEmailTerm}%`) },
         ])
         .getCount();

      const usersDto: UserOutputModel[] = users.map((user) => this.userMapping(user));

      const usersOutput: PaginationWithItems<UserOutputModel> = new PaginationWithItems(
         sortData.pageNumber,
         sortData.pageSize,
         totalCount,
         usersDto,
      );
      return usersOutput;
   }

   private userMapping(user: User_Orm): UserOutputModel {
      return {
         id: user.id,
         login: user.login,
         email: user.email,
         createdAt: user.createdAt.toISOString(),
      };
   }
}