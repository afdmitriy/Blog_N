import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { USER_MODEL_NAME } from './user.constants';
import { User, UserDocument } from '../domain/user.mongoose.entity';

@Injectable()
export class UserRepository {
	constructor(@InjectModel(USER_MODEL_NAME) private userModel: Model<UserDocument>) { }    // как это работает если мы нигде не передаём значение в конструктор?

	async addUser(newUser: User): Promise<true | null> {
		const createdUser = new this.userModel(newUser);   
		const res = await createdUser.save();
		if (!res) return null
		return true
	}

	async getUserById(userId: string): Promise<UserDocument | null> {
		const user = await this.userModel.findOne({ _id: userId });
		return user || null   
	}
// Лучше возвращать UserDocument или можно обычный объект и почему?
	async getUserByLoginOrEmail(
		loginOrEmail: string,
	): Promise<UserDocument | null> {
		return this.userModel.findOne({
			$or: [{ login: loginOrEmail }, { email: loginOrEmail }],
		});
	}

	async deleteUser(userId: string): Promise<boolean> {
		const result = await this.userModel.findByIdAndDelete(userId);
		return !!result;
	}

   async getUserByConfirmCode(
      confirmCode: string
   ): Promise<UserDocument | null> {
         return this.userModel.findOne({ 'emailConfirmationData.confirmCode': confirmCode });
   }

	async getUserByRecoveryCode(
      recoveryCode: string
   ): Promise<UserDocument | null> {
         return this.userModel.findOne({ 'passwordResetData.recoveryCode': recoveryCode });
   }

	async saveUser(user: UserDocument): Promise<void> {
		await user.save();
	}

}
