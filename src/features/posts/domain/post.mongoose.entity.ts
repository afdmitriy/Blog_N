import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PostCreateModel, PostInputModel } from '../api/models/input/post.input';
import { PostOutputModel, PostOutputWithLikesModel } from '../api/models/output/post.output.models';
import { LikeStatusEnum } from '../../../base/models/enums/enums';



export type PostDocument = HydratedDocument<Post>;
@Schema()
export class Post {

	_id: Types.ObjectId;

	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	shortDescription: string;

	@Prop({ required: true })
	content: string;

	@Prop({ required: true })
	blogId: string;

	@Prop({ required: true })
	blogName: string;

	@Prop({ required: true, default: ()=> new Date().toISOString() })
	createdAt: string; 

	constructor(postInput: PostCreateModel) {
		this.title = postInput.title;
		this.shortDescription = postInput.shortDescription;
		this.content = postInput.content;
		this.blogId = postInput.blogId;
		this.blogName = postInput.blogName;
	}

	// toDto(): PostOutputModel {
	// 	return {
	// 		id: this._id.toString(),
	// 		title: this.title,
	// 		shortDescription: this.shortDescription,
	// 		content: this.content,
	// 		createdAt: this.createdAt.toISOString(),
	// 		blogId: this.blogId,
	// 		blogName: this.blogName
	// 	};
	// };

	static toDto(post: PostDocument): PostOutputModel {
		return {
			id: post._id.toString(),
			title: post.title,
			shortDescription: post.shortDescription,
			content: post.content,
			createdAt: post.createdAt,
			blogId: post.blogId,
			blogName: post.blogName
		}
	}

	temporaryDto(postDto: PostOutputModel): PostOutputWithLikesModel {
		return {
         ...postDto,
			extendedLikesInfo: {
				likesCount: 0,
				dislikesCount: 0,
				myStatus: LikeStatusEnum.None,
				newestLikes: []
			}
		}
	}

	updatePost(params: PostInputModel): void {
		this.title = params.title;
		this.shortDescription = params.shortDescription;
		this.content = params.content;
		this.blogId = params.blogId;
	}
}
export const PostSchema = SchemaFactory.createForClass(Post); 
PostSchema.loadClass(Post);