import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument, Types} from 'mongoose';
import { BlogInputModel } from '../../api/models/input/blog.input';
import { BlogOutputModel } from '../../api/models/output/blog.output.models';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {

	_id: Types.ObjectId;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	description: string;

	@Prop({ required: true })
	websiteUrl: string;

	@Prop({ required: true, default: ()=> new Date().toISOString() })
	createdAt: string

	@Prop({ required: true, default: false })
	isMembership: boolean;

	constructor(blogInput: BlogInputModel) {
		this.name = blogInput.name;
		this.description = blogInput.description;
		this.websiteUrl = blogInput.websiteUrl;
	}
	
	// toDto(): BlogOutputModel {
	// 	return {
	// 		id: this._id.toString(),
	// 		name: this.name,
	// 		description: this.description,
	// 		websiteUrl: this.websiteUrl,
	// 		createdAt: this.createdAt.toISOString(),
	// 		isMembership: this.isMembership
	// 	};
	// }

	static toDto(blog: BlogDocument): BlogOutputModel {
		return {
			id: blog._id.toString(),
			name: blog.name,
			description: blog.description,
			websiteUrl: blog.websiteUrl,
			createdAt: blog.createdAt,
			isMembership: blog.isMembership
		};
	}

	updateBlog(params: BlogInputModel): void {
		this.name = params.name;
		this.description = params.description;
		this.websiteUrl = params.websiteUrl;
	}
}

export const BlogSchema = SchemaFactory.createForClass(Blog); 

BlogSchema.loadClass(Blog);

// BlogSchema.method("toDto", function (): BlogOutputModel {
// 	return {
// 		id: this._id.toString(),
// 		name: this.name,
// 		description: this.description,
// 		websiteUrl: this.websiteUrl,
// 		createdAt: this.createdAt.toISOString(),
// 		isMembership: this.isMembership
// 	};
// })

// BlogSchema.method({updateBlog(params: BlogInputModel): void {
// 	this.name = params.name;
// 	this.description = params.description;
// 	this.websiteUrl = params.websiteUrl;
// }})
