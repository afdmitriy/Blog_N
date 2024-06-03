export interface QueryPaginationModel {
	sortBy?: string;
	sortDirection?: 'asc' | 'desc';
	pageNumber?: string;
	pageSize?: string;
}

export interface QuerySortModel {
	sortBy: string;
   sortDirection: 'desc' | 'asc';
   pageNumber: number;
   pageSize: number;
}
