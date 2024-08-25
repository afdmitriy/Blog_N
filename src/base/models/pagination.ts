export class PaginationWithItems<T> {
	public pagesCount: number;
	public page: number;
	public pageSize: number;
	public totalCount: number;
	public items: T[];
	constructor(
		page: number,
		pageSize: number,
		totalCount: number,
		items: T[],
	) {
		this.pagesCount = Math.ceil(totalCount / pageSize);
		this.page = page;
		this.pageSize = pageSize;
		this.totalCount = totalCount;
		this.items = items
	}
}