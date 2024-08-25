import { Inject, Injectable } from "@nestjs/common";

import { UserCreateModel, UserInputModel } from "../api/models/input/user.input";
import { User } from "../domain/user.mongoose.entity";
import bcrypt from 'bcrypt';
import { UserOutputModel } from "../api/models/output/user.output.model";
import { ResultObjectModel } from "../../../base/models/result.object.type";
import { ResultStatus } from "../../../base/models/enums/enums";
import { UserRepository } from "../infrastructure/user.typeOrm.repository";


@Injectable()
export class UserService {
	constructor(@Inject(UserRepository.name) private readonly userRepository: UserRepository,) {}

	// async createUser(userData: UserInputModel): Promise<ResultObjectModel<UserOutputModel>> {
	// 	const userNameIsExist = await this.userRepository.getUserByLoginOrEmail(userData.login)
	// 	if(userNameIsExist && userNameIsExist._id) return {
	// 		data: null,
	// 		errorMessage: 'User with this name already exist',
	// 		status: ResultStatus.BAD_REQUEST
	// 	}
	// 	const userEmailIsExist = await this.userRepository.getUserByLoginOrEmail(userData.email)
	// 	if(userEmailIsExist && userEmailIsExist._id) return {
	// 		data: null,
	// 		errorMessage: 'User with this email already exist',
	// 		status: ResultStatus.BAD_REQUEST
	// 	}
	// 	const passwordHash = await this.generateHash(userData.password);
	// 	const userCreateData: UserCreateModel = {
	// 		...userData,
	// 		passwordHash
	// 	}
	// 	const newUser = new User(userCreateData);

	// 	await this.userRepository.addUser(newUser);

	// 	const addedUser = await this.userRepository.getUserByLoginOrEmail(userData.email);

	// 	if (!addedUser) return {
	// 		data: null,
	// 		errorMessage: 'Error while create user in DB',
	// 		status: ResultStatus.SERVER_ERROR,
	// 	}

	// 	return {
	// 		data: User.toDto(addedUser),     
	// 		status: ResultStatus.SUCCESS
	// 	}
	// }

	// async getUserById(userId: string): Promise<ResultObjectModel<UserOutputModel>> {
	// 	const user = await this.userRepository.getUserById(userId);
	// 	if (!user) return {
	// 		data: null,
	// 		errorMessage: 'User not found',
	// 		status: ResultStatus.NOT_FOUND,
	// 	}
	// 	return {
	// 		data: User.toDto(user),     
	// 		status: ResultStatus.SUCCESS
	// 	}
	// }
	
	// async deleteUser(UserId: string): Promise<ResultObjectModel<UserOutputModel>> {
	// 	const result = await this.userRepository.deleteUser(UserId);
	// 	if (!result) return {
	// 		data: null,
	// 		errorMessage: 'Error while delete user in DB',
	// 		status: ResultStatus.SERVER_ERROR,
	// 	}
	// 	return {
	// 		data: null,
	// 		status: ResultStatus.SUCCESS
	// 	}
	// }

	// async createConfirmData(userId: string, confirmCode: string): Promise<true | null> {
	// 	const user = await this.userRepository.getUserById(userId)

	// 	if (!user) return null

	// 	user.createConfirmData(confirmCode)

	// 	await user.save()
	// 	return true
	// }

	// async getUserByConfirmCode(confirmCode: string): Promise<ResultObjectModel<UserOutputModel>> {
	// 	const user = await this.userRepository.getUserByConfirmCode(confirmCode)
	// 	if (!user) return {
	// 		data: null,
	// 		errorMessage: 'User not found',
	// 		status: ResultStatus.NOT_FOUND,
	// 	}

	// 	return {
	// 		data: User.toDto(user),
	// 		status: ResultStatus.SUCCESS
	// 	}
	// }

	async generateHash(password: string) {
      const hash = await bcrypt.hash(password, 10);
      return hash;
	}

}
