import { IsEmail, Length, Matches } from "class-validator";
import { NameIsExist } from "../../../../../infrastructure/decorators/validate/user-is-exist.decorator";
import { Trim } from "../../../../../infrastructure/decorators/transform/trim.decorator";
import { QueryPaginationModel, QuerySortModel } from "../../../../../base/models/input/input.models";


export class UserInputModel {
  @Trim()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @NameIsExist()
  login: string;
  @Trim()
  @Length(6, 20)
  password: string;
  @Trim()
  @IsEmail()
  @NameIsExist()
  email: string;
}


export interface UserCreateModel extends UserInputModel {
  passwordHash: string;
}

export interface UserQueryData extends QueryPaginationModel {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
}

export interface UserSortData extends QuerySortModel {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
}


