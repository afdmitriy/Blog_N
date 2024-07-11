import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../../users/infrastructure/user.repository';
import { ResultStatus } from '../../../../base/models/enums/enums';
import { ResultObjectModel } from '../../../../base/models/result.object.type';
import { SessionRepository } from '../../../security/infrastructure/session.repository';

export class RefreshTokensCommand {
   constructor(public deviceId: string
   ) { }
}

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensUseCase implements ICommandHandler<RefreshTokensCommand> {
   constructor(
      protected userRepository: UserRepository,
      @Inject(SessionRepository.name) private readonly sessionRepository: SessionRepository,
      @Inject(AuthService.name) protected authService: AuthService
   ) { }

   async execute(command: RefreshTokensCommand): Promise<ResultObjectModel<{ accessToken: string, refreshToken: string }> | false> {
      try {
         const session = await this.sessionRepository.findSessionById(command.deviceId);
         session!.extendSession()
         session!.save()
         const deviceIdString = session!._id.toString()
         const tokens = await this.authService.generateTokens(session!.userId, deviceIdString, session!.issuedAt);
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