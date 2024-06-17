import { IsEmail, Length, Matches } from "class-validator";
import { QueryPaginationModel, QuerySortModel } from "src/base/models/input/input.models";
import { Trim } from "src/infrastructure/decorators/transform/trim.decorator";

export class UserInputModel {
  @Trim()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;
  @Trim()
  @Length(6, 20)
  password: string;
  @Trim()
  @IsEmail()
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
