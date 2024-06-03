import { QueryPaginationModel, QuerySortModel } from "src/base/models/input/input.models";


export interface BlogInputModel {
	name: string;
	description: string;
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