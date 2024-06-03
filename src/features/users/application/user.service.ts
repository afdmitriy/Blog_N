import { Injectable } from "@nestjs/common";
import { UserRepository, } from "../infrastructure/user.repository";
import { UserCreateModel, UserInputModel } from "../api/models/input/user.input";
import { User } from "../domain/user.mongoose.entity";
import bcrypt from 'bcrypt';
import { UserOutputModel } from "../api/models/output/user.output.model";
import { ResultStatus } from "src/base/models/enums/enums";
import { ResultObjectModel } from "src/base/models/result.object.type";

@Injectable()
export class UserService {
	constructor(protected userRepository: UserRepository) {}

	async createUser(userData: UserInputModel): Promise<ResultObjectModel<UserOutputModel>> {
		const passwordSalt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(userData.password, passwordSalt);
		const userCreateData: UserCreateModel = {
			...userData,
			passwordHash,
			passwordSalt
		}
		const newUser = new User(userCreateData);

		await this.userRepository.addUser(newUser);

		const addedUser = await this.userRepository.getUserByLoginOrEmail(userData.email);

		if (!addedUser) return {
			data: null,
			errorMessage: 'Error while create user in DB',
			status: ResultStatus.SERVER_ERROR,
		}

		return {
			data: User.toDto(addedUser),     
			status: ResultStatus.SUCCESS
		}
	}

	async getUserById(userId: string): Promise<ResultObjectModel<UserOutputModel>> {
		const user = await this.userRepository.getUserById(userId);
		if (!user) return {
			data: null,
			errorMessage: 'User not found',
			status: ResultStatus.NOT_FOUND,
		}
		return {
			data: User.toDto(user),     
			status: ResultStatus.SUCCESS
		}
	}
	
	async deleteUser(UserId: string): Promise<ResultObjectModel<UserOutputModel>> {
		const result = await this.userRepository.deleteUser(UserId);
		if (!result) return {
			data: null,
			errorMessage: 'Error while delete user in DB',
			status: ResultStatus.SERVER_ERROR,
		}
		return {
			data: null,
			status: ResultStatus.SUCCESS
		}
	}

}
