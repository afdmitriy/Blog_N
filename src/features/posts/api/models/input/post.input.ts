import { IsNotEmpty, IsString, Length} from "class-validator";
import { Trim } from "../../../../../infrastructure/decorators/transform/trim.decorator";
import { BlogIsExist } from "../../../../../infrastructure/decorators/validate/blog-is-exist.decorator";

export class PostWithoutBlogInputModel {
	@Trim()
	@IsString()
	@IsNotEmpty()
	@Length(1, 30)
	title: string;
	@Trim()
	@IsString()
	@IsNotEmpty()
	@Length(1, 100)
	shortDescription: string;
	@Trim()
	@IsString()
	@IsNotEmpty()
	@Length(1, 1000)
	content: string;
}

export class PostInputModel extends PostWithoutBlogInputModel {
	@BlogIsExist()
	blogId: string
}

// export interface PostCreateModel extends PostInputModel {
// 	blogName: string
// }
