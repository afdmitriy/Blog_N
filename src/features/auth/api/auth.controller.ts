import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Ip, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "../application/auth.service";
import { LocalAuthGuard } from "src/infrastructure/guards/local-auth.guard";
import { CurrentUserId } from "src/infrastructure/decorators/transform/current-user-id.param.decorator";
import { UserInputModel } from "src/features/users/api/models/input/user.input";
import { CommandBus } from "@nestjs/cqrs";
import { UserRegistrationCommand } from "../application/use-cases/registrate-user.use-case";
import { JwtAuthGuard } from "src/infrastructure/guards/jwt-auth.guard";
import { UserService } from "src/features/users/application/user.service";
import { ResultStatus } from "src/base/models/enums/enums";
import { UserLoginCommand } from "../application/use-cases/login-user.use-case";
import { UserAgent } from "src/infrastructure/decorators/transform/user-agent.from.headers.decorator";
import { Response } from "express";
import { EmailResendingModel, NewPasswordModel } from "./models/input/auth.input.models";
import { PasswordRecoveryCommand } from "../application/use-cases/password-recovery.use-case";
import { SetNewPasswordCommand } from "../application/use-cases/new-password.use-case";

@Controller('auth')
export class AuthController {
   constructor(private commandBus: CommandBus,
      private readonly authService: AuthService,
      private readonly userService: UserService,
   ) {}

   @Get('me')
   @UseGuards(JwtAuthGuard)
   @HttpCode(200)
   async getMe(@CurrentUserId() userId: string): Promise<{email: string; login: string; userId: string;}> {
      const user = await this.userService.getUserById(userId)
      if(user.status !== ResultStatus.SUCCESS) throw new HttpException(`user do not exist`, HttpStatus.NOT_FOUND);
      const outputUser = {
         email: user.data!.email,
         login: user.data!.login,
         userId: user.data!.id
      }
      return outputUser
   }

   @Post('registration')
   @HttpCode(204)
   async registration(@Body() newUser: UserInputModel): Promise<void> {
      const res = await this.commandBus.execute(new UserRegistrationCommand(newUser));
      if(!res) throw new HttpException(`User or email already exist`, HttpStatus.BAD_REQUEST)
      return
   }

   @Post('registration-confirmation')
   @HttpCode(204)
   async registrationConfirmation(code: string): Promise<void> {
      await this.authService.userRegistrationConfirmation(code)
      return
   }

   @Post('registration-email-resending')
   @HttpCode(204)
   async emailResend(@Body() body: EmailResendingModel): Promise<void> {
      await this.authService.resendEmail(body.email)
      return
   }

   @Post('login')
   @UseGuards(LocalAuthGuard)
   @HttpCode(200)
   async login(@CurrentUserId() userId: string,
      @UserAgent() deviceName: string,
      @Ip() ip: string, 
      @Res({ passthrough: true }) res: Response,): Promise<{accessToken: string;}> {
      const tokenPair =  await this.commandBus.execute(new UserLoginCommand(userId, deviceName, ip));
      res.cookie('refreshToken', tokenPair.refreshToken, { httpOnly: true, secure: true });
      return {accessToken: tokenPair.accessToken}
   }

   @Post('password-recovery')
   @HttpCode(204)
   async passwordRecovery(@Body() body: EmailResendingModel): Promise<void> {
      await this.commandBus.execute(new PasswordRecoveryCommand(body.email))
   }

   @Post('new-password')
   @HttpCode(204)
   async setNewPassword(@Body() body: NewPasswordModel): Promise<void> {
      await this.commandBus.execute(new SetNewPasswordCommand(body.newPassword, body.recoveryCode))
   }
}