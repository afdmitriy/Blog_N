
export interface PostInputModel {
	title: string;
	shortDescription: string;
	content: string;
	blogId: string
}

export interface PostCreateModel extends PostInputModel {
	blogName: string
}
