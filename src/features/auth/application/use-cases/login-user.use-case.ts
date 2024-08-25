import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { Inject } from '@nestjs/common';
import { ResultStatus } from '../../../../base/models/enums/enums';
import { ResultObjectModel } from '../../../../base/models/result.object.type';
import { UserRepository } from '../../../users/infrastructure/user.typeOrm.repository';
import { SessionRepository } from '../../../security/infrastructure/session.typeOrm.repository';
import { Session_Orm } from '../../../security/domain/session.typeOrm.entity';
import { add } from 'date-fns';
import { jwtConstants } from '../../../../infrastructure/constants/constants';
import { SessionCreateModel } from '../../../security/api/models/input/create.session.model';


export class UserLoginCommand {
   constructor(public userId: string,
      public deviceName: string,
      public ip: string
   ) { }
}

@CommandHandler(UserLoginCommand)
export class UserLoginUseCase implements ICommandHandler<UserLoginCommand> {
   constructor(
      @Inject(SessionRepository.name) private readonly sessionRepository: SessionRepository,
      @Inject(AuthService.name) protected authService: AuthService,
      @Inject(UserRepository.name) private readonly userRepository: UserRepository
   ) { }

   async execute(command: UserLoginCommand): Promise<ResultObjectModel<{ accessToken: string, refreshToken: string }> | false> {
      try {
         const user = await this.userRepository.getById(command.userId);
         if (!user) return {
            data: null,
            errorMessage: 'User not found',
            status: ResultStatus.NOT_FOUND
         }
         const sessionDuration = parseInt(jwtConstants.refreshExpiresIn.slice(0, -1));

         const sessionModel: SessionCreateModel = {
            userId: user.id,
            ip: command.ip ?? 'Unknown',
            deviceName: command.deviceName ?? 'Unknown',
            expirationDate: add(new Date(), {
               days: sessionDuration
            })
         }
         const session = Session_Orm.createSession(sessionModel);
         const newSession = await this.sessionRepository.save(session)
         const dateString = newSession.updatedAt.toISOString()
         const tokens = await this.authService.generateTokens(command.userId, newSession.id, dateString);
         
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