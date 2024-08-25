import { IsEnum, IsString } from "class-validator";
import { Trim } from "../../../infrastructure/decorators/transform/trim.decorator";
import { LikeStatusEnum } from "../enums/enums";

export interface QueryPaginationModel {
	sortBy?: string;
	sortDirection?: 'ASC' | 'DESC';
	pageNumber?: string;
	pageSize?: string;
}

export interface QuerySortModel {
	sortBy: string;
   sortDirection: 'DESC' | 'ASC';
   pageNumber: number;
   pageSize: number;
}

export class InputLikeStatusModel {
	@Trim()
	@IsString()
	@IsEnum(LikeStatusEnum)
	likeStatus: LikeStatusEnum
}		