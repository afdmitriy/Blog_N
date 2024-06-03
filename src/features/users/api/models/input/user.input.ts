
export interface UserInputModel {
	login: string;
	password: string;
	email: string;
}

export interface UserCreateModel extends UserInputModel {
	passwordHash: string;
	passwordSalt: string;
}

export interface UserQueryData {
	sortBy?: string;
	sortDirection?: 'asc' | 'desc';
	pageNumber?: string;
	pageSize?: string;
	searchLoginTerm?: string;
	searchEmailTerm?: string;
}

export interface UserSortData {
   searchLoginTerm: string | null;
   searchEmailTerm: string | null;
   sortBy: string;
   sortDirection: 'desc' | 'asc';
   pageNumber: number;
   pageSize: number;
}