import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../../users/infrastructure/user.repository';
import { ResultStatus } from '../../../../base/models/enums/enums';
import { ResultObjectModel } from '../../../../base/models/result.object.type';
import { Session } from '../../../security/domain/session.mongoose.entity';
import { SessionRepository } from '../../../security/infrastructure/session.repository';

export class UserLoginCommand {
   constructor(public userId: string,
      public deviceName: string,
      public ip: string
   ) { }
}

@CommandHandler(UserLoginCommand)
export class UserLoginUseCase implements ICommandHandler<UserLoginCommand> {
   constructor(
      protected userRepository: UserRepository,
      @Inject(SessionRepository.name) private readonly sessionRepository: SessionRepository,
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
         const session = Session.createSession(command.userId,command.ip, command.deviceName);
         const newSession = await this.sessionRepository.createSession(session)
         
         const deviceIdString = newSession._id.toString()
         const tokens = await this.authService.generateTokens(command.userId, deviceIdString, session.issuedAt);
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