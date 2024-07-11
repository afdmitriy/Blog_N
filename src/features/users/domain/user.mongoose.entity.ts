import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserCreateModel } from '../api/models/input/user.input';
import { UserOutputModel } from '../api/models/output/user.output.model';
import { add } from 'date-fns';

@Schema()
export class PasswordResetData {

	@Prop({ required: true })
	recoveryCode: string;

	@Prop({ required: true})
	createdAt: string;

	@Prop({ required: true })
	expirationDate: string

	@Prop({ required: true, default: false })
	isConfirmed: boolean
}
export const PasswordResetDataSchema = SchemaFactory.createForClass(PasswordResetData); 

@Schema()
export class EmailConfirmationData {

	@Prop({ required: true })
	confirmCode: string;

	@Prop({ required: true})
	createdAt: string;

	@Prop({ required: true })
	expirationDate: string

	@Prop({ required: true, default: false })
	isConfirmed: boolean
}
export const EmailConfirmationDataSchema = SchemaFactory.createForClass(EmailConfirmationData); 


@Schema()
export class User {

	_id: Types.ObjectId

	@Prop({ required: true })
	login: string;

	@Prop({ required: true })
	email: string;

	@Prop({ required: true, default: ()=> new Date().toISOString() })
	createdAt: string

	@Prop({ required: true })
	passwordHash: string;

	@Prop({ _id: false, required: false, type: EmailConfirmationDataSchema })
   emailConfirmation: EmailConfirmationData;

	@Prop({required: false, type: PasswordResetDataSchema})
	passwordResetData: PasswordResetData

	constructor(userInput: UserCreateModel) {     
		this.login = userInput.login;
		this.email = userInput.email;
		this.passwordHash = userInput.passwordHash;
		this.createdAt = new Date().toISOString();
	}

	static toDto(user: UserDocument): UserOutputModel {
		return {
			id: user._id.toString(),
			login: user.login,
			email: user.email,
			createdAt: user.createdAt,
		};
	}
	
	createConfirmData(confirmCode: string) {
		this.emailConfirmation = {
			confirmCode: confirmCode,
			createdAt: new Date().toISOString(),
			isConfirmed: false,
			expirationDate: add(new Date(), {
				hours: 1,
			}).toISOString()
		}
	}

	createPasswordRecoveryData(recoveryCode: string) {
		this.passwordResetData = {
			recoveryCode: recoveryCode,
			createdAt: new Date().toISOString(),
			isConfirmed: false,
			expirationDate: add(new Date(), {
				minutes: 20,
			}).toISOString()
		}
	}

	confirmEmail() {
		this.emailConfirmation.isConfirmed = true
	}

	updatePassword(passwordHash: string) {
		this.passwordHash = passwordHash
	}
}

export const UserSchema = SchemaFactory.createForClass(User); 
// export const UserModel = model<User>('User', UserSchema);
export type UserDocument = HydratedDocument<User>;
UserSchema.loadClass(User); 