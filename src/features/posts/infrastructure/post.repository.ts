import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { POST_MODEL_NAME } from './post.constants';
import { Post, PostDocument } from '../domain/post.mongoose.entity';


@Injectable()
export class PostRepository {
	constructor(@InjectModel(POST_MODEL_NAME) private postModel: Model<PostDocument>) { }

	async createPost(newPost: Post): Promise<PostDocument> {
		const createdPost = new this.postModel(newPost);
		return await createdPost.save();
	}

	async getPostById(postId: string): Promise<PostDocument | null> {
		return this.postModel.findById(postId);
	}

	async deletePost(postId: string): Promise<boolean> {
		const result = await this.postModel.findByIdAndDelete(postId);
		console.log(result)
		return !!result;
	}

	async updatePostById(postId: string, updatedPost: Post): Promise<PostDocument | null> {
		return this.postModel.findByIdAndUpdate(postId, updatedPost, { new: true });
	}

	async savePost(post: PostDocument): Promise<void> {
		await post.save();
	}
}
