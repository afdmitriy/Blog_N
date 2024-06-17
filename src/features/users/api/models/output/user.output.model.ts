export interface UserOutputModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
}

export interface OutputUsersWithQuery {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserOutputModel[];
}