import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../application/user.service';
import { UserQueryRepository } from '../infrastructure/user.query.repository';
import { UserInputModel, UserQueryData, UserSortData} from './models/input/user.input';
import { UserOutputModel } from './models/output/user.output.model';
import { ResultStatus } from 'src/base/models/enums/enums';
import { BasicAuthGuard } from 'src/infrastructure/guards/auth-basic.guard';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UserController {
   constructor(protected readonly userService: UserService, 
      protected readonly userQueryRepository: UserQueryRepository,
   ) {}

   @Post('')
   async createUser(@Body() inputUser: UserInputModel): Promise<UserOutputModel> {
      const result = await this.userService.createUser(inputUser);
      if (result.status === ResultStatus.SUCCESS) {
         return result.data!;
      }
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }

   @Get('')
   async getUsers(@Query() queryParams: UserQueryData) {
      const userParams: UserSortData = {
         searchLoginTerm: queryParams.searchLoginTerm ?? null,
         searchEmailTerm: queryParams.searchEmailTerm ?? null,
         sortBy: queryParams.sortBy ?? 'createdAt',
         sortDirection: queryParams.sortDirection ?? 'desc',
         pageNumber: queryParams.pageNumber ? +queryParams.pageNumber : 1,
         pageSize: queryParams.pageSize ? +queryParams.pageSize : 10,
      };
      return this.userQueryRepository.getAllUsers(userParams);
   }

   @Delete(':userId')
   @HttpCode(204)
   async deleteUser(@Param('userId') userId: string): Promise<void> {
      const deleteResult = await this.userService.deleteUser(userId);
      if (deleteResult.status === ResultStatus.SUCCESS) return
      throw new HttpException(`user do not exist`, HttpStatus.NOT_FOUND);
   }
}

