import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { USER_MODEL_NAME } from "./user.constants";
import { FilterQuery, Model } from "mongoose";
import { User, UserDocument } from "../domain/user.mongoose.entity";
import { UserSortData } from "../api/models/input/user.input";
import { OutputUsersWithQuery } from "../api/models/output/user.output.model";


import { userMapper } from "../../../infrastructure/utils/mappers/user.mapper";


@Injectable()
export class UserQueryRepository {
   constructor(@InjectModel(USER_MODEL_NAME) private userModel: Model<UserDocument>) { }
   async getAllUsers(
      sortData: UserSortData
   ): Promise<OutputUsersWithQuery | false> {
      const {
         sortDirection,
         sortBy,
         pageNumber,
         pageSize,
         searchEmailTerm,
         searchLoginTerm,
      } = sortData;

      const filter: FilterQuery<User> = {
          $or: [
            { email: { $regex: searchEmailTerm ?? '', $options: 'i' } },
            { login: { $regex: searchLoginTerm ?? '', $options: 'i' } }]
      };

      // if (searchLoginTerm) {
      //    filter.login = {
      //       $regex: searchLoginTerm,
      //       $options: 'i',
      //    }
      // }

      // if (searchEmailTerm) {
      //    filter.email = {
      //       $regex: searchEmailTerm,
      //       $options: 'i',
      //    }
      // }

      try {
         const users = await this.userModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()
            .exec()


         const totalCount = await this.userModel.countDocuments(filter);
         const pagesCount = Math.ceil(totalCount / pageSize);

         return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: users.map(userMapper),
         };
      } catch (error) {
         console.log(error);
         return false;
      }
   }
}