import { QueryPaginationModel, QuerySortModel } from "src/base/models/input/input.models";
import { Trim } from "../../../../../infrastructure/decorators/transform/trim.decorator";
import { Length, Matches } from "class-validator";


export class BlogInputModel {
	@Trim()
	@Length(1, 15)
	name: string;
	@Trim()
	@Length(1, 500)
	description: string;
	@Trim()
	@Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/, { message: 'Invalid input' })
	@Length(1, 100)
	websiteUrl: string;
}
// type for controller
export interface BlogQueryModel extends QueryPaginationModel {
	searchNameTerm?: string;
}

// type for service
export interface BlogSortModel extends QuerySortModel {
   searchNameTerm: string | null;
}