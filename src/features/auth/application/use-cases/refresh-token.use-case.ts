import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { Inject } from '@nestjs/common';
import { ResultStatus } from '../../../../base/models/enums/enums';
import { ResultObjectModel } from '../../../../base/models/result.object.type';
import { SessionRepository } from '../../../security/infrastructure/session.typeOrm.repository';

export class RefreshTokensCommand {
   constructor(public deviceId: string
   ) { }
}

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensUseCase implements ICommandHandler<RefreshTokensCommand> {
   constructor(
      @Inject(SessionRepository.name) private readonly sessionRepository: SessionRepository,
      @Inject(AuthService.name) protected authService: AuthService
   ) { }

   async execute(command: RefreshTokensCommand): Promise<ResultObjectModel<{ accessToken: string, refreshToken: string }> | false> {
      try {
         const session = await this.sessionRepository.getById(command.deviceId);
         if (!session) return {
            data: null,
            errorMessage: 'Session not found',
            status: ResultStatus.NOT_FOUND
         }
         session.extendSession()
         await this.sessionRepository.save(session)
         const issuedAtString = session.updatedAt.toISOString()
         const userId = session.userId.toString()
         const sessionId = session.id.toString()
         const tokens = await this.authService.generateTokens(userId, sessionId, issuedAtString);
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