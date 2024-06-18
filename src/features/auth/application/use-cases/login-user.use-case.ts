import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { Inject } from '@nestjs/common';
import { UserService } from '../../../users/application/user.service';
import { UserRepository } from '../../../users/infrastructure/user.repository';
import { MailService } from '../../../../infrastructure/adapters/mailer/mail.service';
import { ResultStatus } from '../../../../base/models/enums/enums';
import { ResultObjectModel } from '../../../../base/models/result.object.type';

export class UserLoginCommand {
   constructor(public userId: string,
      public deviceName: string,
      public ip: string
   ) { }
}

@CommandHandler(UserLoginCommand)
export class UserLoginUseCase implements ICommandHandler<UserLoginCommand> {
   constructor(
      protected userService: UserService,
      protected userRepository: UserRepository,
      protected mailService: MailService,
      @Inject(AuthService.name) protected authService: AuthService
   ) { }

   async execute(command: UserLoginCommand): Promise<ResultObjectModel<{ accessToken: string, refreshToken: string }> | false> {
      try {
         const user = await this.userRepository.getUserById(command.userId);
         if (!user) return {
            data: null,
            errorMessage: 'User not found',
            status: ResultStatus.NOT_FOUND
         }
         user.createSession(command.ip, command.deviceName);
         await this.userRepository.saveUser(user)
         const deviceIdString = user.sessionData._id.toString()
         const tokens = await this.authService.generateTokens(command.userId, deviceIdString, user.sessionData.issuedAt);
         return {
            data: tokens,
            status: ResultStatus.SUCCESS
         }
      } catch (error) {
         console.log(error);
         return false;
      }
   }
}