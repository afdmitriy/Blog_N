// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Blog, BlogDocument } from '../domain/entities/blog.mongoose.entity';
// import { BLOG_MODEL_NAME } from './blog.constants';

// @Injectable()
// export class BlogRepository {
// 	constructor(@InjectModel(BLOG_MODEL_NAME) private blogModel: Model<BlogDocument>) { }

// 	async addBlog(newBlog: Blog): Promise<BlogDocument> {
// 		return await this.blogModel.create(newBlog)
// 	}

// 	async getBlogById(blogId: string): Promise<BlogDocument | null> {
// 		return this.blogModel.findById(blogId);
// 	}

// 	async deleteBlog(blogId: string): Promise<boolean> {
// 		const result = await this.blogModel.findByIdAndDelete(blogId);
// 		return !!result;
// 	}

// 	async updateBlogById(blogId: string, updatedBlog: Blog): Promise<BlogDocument | null> {
// 		return this.blogModel.findByIdAndUpdate(blogId, updatedBlog, { new: true });
// 	}

// 	async saveBlog(blog: BlogDocument): Promise<void> {
// 		await blog.save();
// 	}
// }
