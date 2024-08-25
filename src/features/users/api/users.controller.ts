import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../application/user.service';
import { UserInputModel } from './models/input/user.input';
import { UserOutputModel } from './models/output/user.output.model';
import { BasicAuthGuard } from '../../../infrastructure/guards/auth-basic.guard';
import { ResultStatus } from '../../../base/models/enums/enums';
import { QueryPaginationPipe } from '../../../infrastructure/pipes/query.global.pipe';
import { QueryPaginationResult } from '../../../infrastructure/types/query-sort.type';
import { CommandBus } from '@nestjs/cqrs';
import { UserDeleteCommand } from '../application/user.delete.use-case';
import { UserQueryRepository } from '../infrastructure/user.typeOrm.query.repository';
import { UserCreateCommand } from '../application/user.create.use-case';



@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class UserController {
   constructor(protected readonly userService: UserService, 
      @Inject(UserQueryRepository.name) private readonly userQueryRepository: UserQueryRepository,
      private readonly commandBus: CommandBus,
   ) {}

   @Post('')
   async createUser(@Body() inputUser: UserInputModel): Promise<UserOutputModel | null> {
      const result = await this.commandBus.execute(new UserCreateCommand(inputUser))
      if(result.status === ResultStatus.BAD_REQUEST) throw new HttpException('Login or Email already exist', HttpStatus.BAD_REQUEST)
      if (result.status === ResultStatus.SUCCESS) {
         console.log('Result Data = ', result.data)
         return await this.userQueryRepository.getById(result.data)
      }
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }

   @Get('')
   async getUsers(@Query(QueryPaginationPipe) queryParams: QueryPaginationResult) {
      // const userParams: UserSortData = {
      //    searchLoginTerm: queryParams.searchLoginTerm ?? null,
      //    searchEmailTerm: queryParams.searchEmailTerm ?? null,
      //    sortBy: queryParams.sortBy ?? 'createdAt',
      //    sortDirection: queryParams.sortDirection ?? 'desc',
      //    pageNumber: queryParams.pageNumber ? +queryParams.pageNumber : 1,
      //    pageSize: queryParams.pageSize ? +queryParams.pageSize : 10,
      // };
      return this.userQueryRepository.getAll(queryParams);
   }

   @Delete(':userId')
   @HttpCode(204)
   async deleteUser(@Param('userId') userId: string): Promise<void> {
      const result = await this.commandBus.execute(new UserDeleteCommand(userId))
      if (result.status === ResultStatus.NOT_FOUND) throw new HttpException(`User or session not found`, HttpStatus.NOT_FOUND)
      if (result.status === ResultStatus.SUCCESS) return
   }
}

