import { Inject, Injectable } from "@nestjs/common";
import bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from 'uuid';
import { UserService } from "../../users/application/user.service";
import { MailService } from "../../../infrastructure/adapters/mailer/mail.service";
import { ResultObjectModel } from "../../../base/models/result.object.type";
import { ResultStatus } from "../../../base/models/enums/enums";
import { jwtConstants } from "../../../infrastructure/constants/constants";
import { UserRepository } from "../../users/infrastructure/user.typeOrm.repository";
import { SessionRepository } from "../../security/infrastructure/session.typeOrm.repository";
import { add } from "date-fns";


@Injectable()
export class AuthService {
   constructor(
      
      @Inject(UserRepository.name) protected readonly userRepository: UserRepository,
      protected readonly userService: UserService,
      protected readonly jwtService: JwtService,
      protected readonly mailService: MailService,
      @Inject(SessionRepository.name) private readonly sessionRepository: SessionRepository
   ) { }

   async resendEmail(mail: string): Promise<boolean | null> {
      const token = uuidv4();
      try {
         const user =
            await this.userRepository.getByLoginOrEmail(
               mail
            );
         if (!user) return null;
         if (user.isConfirmed != false) return false;

         const date = add(new Date(), {
				hours: 1,
			})

         user.addConfirmData(token, date)
         await this.userRepository.save(user)
         await this.mailService.sendUserConfirmation(user.email, user.login, token)
         return true

      } catch (error) {
         console.log(error);
         return false;
      }
   }

   // async userRegistrationConfirmation(confirmationCode: string): Promise<boolean | null> {
   //    // приходит код, проверяю, что он есть в базе, не протух и isConfirmed это false, вношу подтверждение в isConfirmed
   //    try {
   //       const user =
   //          await this.userRepository.getUserByConfirmCode(
   //             confirmationCode
   //          );
   //       if (!user) {
   //          return null;
   //       }
   // //       const date = Date.parse(user.emailConfirmation.expirationDate)
   // //       if (new Date(date) < new Date()) {
   // //          return false;
   // //       }
   // //       if (user.emailConfirmation.isConfirmed != false) {
   // //          return false;
   // //       }
   //       user.confirmEmail()
   //       await this.userRepository.saveUser(user);
   //       return true;
   //    } catch (error) {
   //       console.log(error);
   //       return false;
   //    }
   // }



   async validateUser(loginOrEmail: string, password: string): Promise<ResultObjectModel<{ userId: string }>> {
      const user = await this.userRepository.getByLoginOrEmail(loginOrEmail);
      if (!user) return {
         data: null,
         errorMessage: 'Login or email not found',
         status: ResultStatus.UNAUTHORIZED
      };

      // if (user.isConfirmed === false) return {
      //    data: null,
      //    errorMessage: 'Email not confirmed',
      //    status: ResultStatus.UNAUTHORIZED
      // }

      const isPasswordEquals = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordEquals) return {
         data: null,
         errorMessage: 'Wrong password',
         status: ResultStatus.UNAUTHORIZED
      };
      return {
         data: { userId: user.id },
         status: ResultStatus.SUCCESS 
      };
   }

   async generateTokens(userId: string, deviceId: string, issuedAt: string): Promise<{
      accessToken: string;
      refreshToken: string;
   }> {

      const accessToken = await this.jwtService.signAsync({
         userId
      }, {
         expiresIn: jwtConstants.accessExpiresIn,
         secret: jwtConstants.secretAccess
      });
      const refreshToken = await this.jwtService.signAsync({
         userId,
         deviceId,
         issuedAt
      }, {
         expiresIn: jwtConstants.refreshExpiresIn,
         secret: jwtConstants.secretRefresh
      })
      console.log('accessToken', refreshToken)
      return {
         accessToken: accessToken,
         refreshToken: refreshToken
      }
   }

   async sessionIsValid(userId: string, deviceId: string, issuedAt: string): Promise<boolean> {
      const session = await this.sessionRepository.getById(deviceId);
      if (!session) return false;
      if (session.id !== deviceId) return false;
      // Check version as issued at
      if (issuedAt !== session.updatedAt.toISOString()) return false;
      return true
   }
} 

