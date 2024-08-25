import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../base/models/result.object.type";
import { ResultStatus } from "../../../base/models/enums/enums";
import { Inject } from "@nestjs/common";
import { UserRepository } from "../infrastructure/user.typeOrm.repository";
import { UserCreateModel, UserInputModel } from "../api/models/input/user.input";
import { UserService } from "./user.service";
import { User_Orm } from "../domain/user.typeOrm.entity";

export class UserCreateCommand {
   constructor(public userData: UserInputModel,
   ) { }
}

@CommandHandler(UserCreateCommand)
export class UserCreateUseCase implements ICommandHandler<UserCreateCommand> {
   constructor(
      @Inject(UserRepository.name) private readonly userRepository: UserRepository,
      private readonly userService: UserService,
   ) {}
   async execute(command: UserCreateCommand): Promise<ResultObjectModel<string>> {

      const userNameIsExist = await this.userRepository.getByLoginOrEmail(command.userData.login)
		if(userNameIsExist) return {
			data: null,
			errorMessage: 'User with this name already exist',
			status: ResultStatus.BAD_REQUEST
		}

		const userEmailIsExist = await this.userRepository.getByLoginOrEmail(command.userData.email)
		if(userEmailIsExist) return {
			data: null,
			errorMessage: 'User with this email already exist',
			status: ResultStatus.BAD_REQUEST
		}
		const passwordHash = await this.userService.generateHash(command.userData.password);
		const userCreateData: UserCreateModel = {
			...command.userData,
			passwordHash
		}
		const newUser = User_Orm.createUserModel(userCreateData);

		const addedUser = await this.userRepository.save(newUser);
		console.log('User id = ', addedUser.id)

		return {
			data: addedUser.id,   
			status: ResultStatus.SUCCESS
		}
   }
}