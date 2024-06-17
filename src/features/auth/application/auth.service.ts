import { Injectable } from "@nestjs/common";

import { ResultObjectModel } from "src/base/models/result.object.type";
import { UserService } from "src/features/users/application/user.service";
import { UserRepository } from "src/features/users/infrastructure/user.repository";
import bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
import { User } from "src/features/users/domain/user.mongoose.entity";
import { v4 as uuidv4 } from 'uuid';
import { MailService } from "src/infrastructure/adapters/mailer/mail.service";
import { jwtConstants } from "src/infrastructure/constants/constants";
import { ResultStatus } from "src/base/models/enums/enums";

@Injectable()
export class AuthService {
   constructor(protected readonly userRepository: UserRepository,
      protected readonly userService: UserService,
      protected readonly jwtService: JwtService,
      protected readonly mailService: MailService
   ) { }

   // async registrateUser(userData: UserInputModel): Promise<boolean> {
   //    const token = uuidv4();
   //    try {
   //       const newUser = await this.userService.createUser(userData);
   //       if (newUser.status !== ResultStatus.SUCCESS) {
   //          return false;
   //       }
   //       const isCreate = await this.userService.createConfirmData(
   //          newUser.data!.id,
   //          token
   //       );
   //       if (!isCreate) {
   //          console.log('Error: authService.userRegistration, isCreate');
   //          return false;
   //       }

   //       await this.mailService.sendUserConfirmation(userData.email, userData.login, token)

   //       return true;
   //    } catch (error) {
   //       console.log(error);
   //       return false;
   //    }
   // }

   async resendEmail(mail: string): Promise<boolean | null> {
      const token = uuidv4();
      try {
         const user =
            await this.userRepository.getUserByLoginOrEmail(
               mail
            );
         if (!user) return null;
         if (user.emailConfirmation.isConfirmed != false) return false;
         user.createConfirmData(token)
         await this.userRepository.saveUser(user)
         await this.mailService.sendUserConfirmation(user.email, user.login, token)
         return true

      } catch (error) {
         console.log(error);
         return false;
      }
   }

   async userRegistrationConfirmation(confirmationCode: string): Promise<boolean | null> {
      // приходит код, проверяю, что он есть в базе, не протух и isConfirmed это false, вношу подтверждение в isConfirmed
      try {
         const user =
            await this.userRepository.getUserByConfirmCode(
               confirmationCode
            );
         if (!user) {
            return null;
         }
         const date = Date.parse(user.emailConfirmation.expirationDate)
         if (new Date(date) < new Date()) {
            return false;
         }
         if (user.emailConfirmation.isConfirmed != false) {
            return false;
         }
         user.confirmEmail()
         await this.userRepository.saveUser(user);
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   }



   async validateUser(login: string, password: string): Promise<ResultObjectModel<{ userId: string }>> {
      console.log('ValidateUser 1')
      const user = await this.userRepository.getUserByLoginOrEmail(login);
      if (!user) return {
         data: null,
         errorMessage: 'Login not found',
         status: ResultStatus.NOT_FOUND
      };
      const isPasswordEquals = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordEquals) return {
         data: null,
         errorMessage: 'Wrong password',
         status: ResultStatus.UNAUTHORIZED
      };
      const userDto = User.toDto(user)
      return {
         data: { userId: userDto.id },
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
         expiresIn: jwtConstants.accessExpiresIn
      });
      const refreshToken = await this.jwtService.signAsync({
         userId,
         deviceId,
         issuedAt
      }, {
         expiresIn: jwtConstants.refreshExpiresIn
      })
      return {
         accessToken: accessToken,
         refreshToken: refreshToken
      }
   }

   async sessionIsValid(userId: string, deviceId: string, issuedAt: string) {
      const user = await this.userRepository.getUserById(userId);
      if (!user) return false;
      if (user.sessionData._id.toString() !== deviceId) return false;
      if (issuedAt !== user.sessionData.issuedAt) return false;

      return true
   }
} 