import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserCreateModel } from '../api/models/input/user.input';
import { UserOutputModel } from '../api/models/output/user.output.model';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

	_id: Types.ObjectId;

	@Prop({ required: true })
	login: string;

	@Prop({ required: true })
	email: string;

	@Prop({ required: true, default: ()=> new Date().toISOString() })
	createdAt: string

	@Prop({ required: true })
	passwordHash: string;

	@Prop({ required: true })
	passwordSalt: string;

	constructor(userInput: UserCreateModel) {     
		this.login = userInput.login;
		this.email = userInput.email;
		this.passwordHash = userInput.passwordHash;
		this.passwordSalt = userInput.passwordSalt;
	}

	static toDto(user: UserDocument): UserOutputModel {
		return {
			id: user._id.toString(),
			login: user.login,
			email: user.email,
			createdAt: user.createdAt,
		};
	}
	

}

export const UserSchema = SchemaFactory.createForClass(User); 
UserSchema.loadClass(User); 
// export const UserModel = model<User>('User', UserSchema);