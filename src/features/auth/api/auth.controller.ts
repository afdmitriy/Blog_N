import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Ip, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "../application/auth.service";
import { CommandBus } from "@nestjs/cqrs";
import { UserRegistrationCommand } from "../application/use-cases/registrate-user.use-case";
import { UserLoginCommand } from "../application/use-cases/login-user.use-case";
import { Response } from "express";
import { EmailResendingModel, NewPasswordModel, ValidationCodeModel } from "./models/input/auth.input.models";
import { PasswordRecoveryCommand } from "../application/use-cases/password-recovery.use-case";
import { SetNewPasswordCommand } from "../application/use-cases/new-password.use-case";
import { LocalAuthGuard } from "../../../infrastructure/guards/local-auth.guard";
import { UserService } from "../../users/application/user.service";
import { JwtAuthGuard } from "../../../infrastructure/guards/jwt-auth.guard";
import { CurrentUserId } from "../../../infrastructure/decorators/transform/current-user-id.param.decorator";
import { ResultStatus } from "../../../base/models/enums/enums";
import { UserInputModel } from "../../users/api/models/input/user.input";
import { UserAgent } from "../../../infrastructure/decorators/transform/user-agent.from.headers.decorator";
import { JwtCookieGuard } from "../../../infrastructure/guards/jwt-cookie.guard";
import { RefreshCookieInputModel } from "../../security/api/models/input/refresh.cookie.model";
import { DeviceDeleteCommand } from "../../security/application/delete.device.use-case";
import { RefreshTokensCommand } from "../application/use-cases/refresh-token.use-case";
import { ThrottlerGuard } from "@nestjs/throttler";

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
   constructor(private commandBus: CommandBus,
      @Inject(AuthService.name) private readonly authService: AuthService,
      private readonly userService: UserService,
   ) { }

   @Get('me')
   @UseGuards(JwtAuthGuard)
   @HttpCode(200)
   async getMe(@CurrentUserId() userId: string): Promise<{ email: string; login: string; userId: string; }> {
      const user = await this.userService.getUserById(userId)
      if (user.status !== ResultStatus.SUCCESS) throw new HttpException(`user do not exist`, HttpStatus.NOT_FOUND);
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
      if (!res) throw new HttpException(`User or email already exist`, HttpStatus.BAD_REQUEST)
      return
   }

   @Post('registration-confirmation')
   @HttpCode(204)
   async registrationConfirmation(@Body() code: ValidationCodeModel): Promise<void> {
      await this.authService.userRegistrationConfirmation(code.code)
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
      @Res({ passthrough: true }) res: Response,): Promise<{ accessToken: string }> {
      const result = await this.commandBus.execute(new UserLoginCommand(userId, deviceName, ip));
      if (result.status === ResultStatus.NOT_FOUND) throw new HttpException(`User not found`, HttpStatus.BAD_REQUEST)
      res.cookie('refreshToken', result.data.refreshToken, { httpOnly: true, secure: true });
      return { accessToken: result.data.accessToken }
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

   @Post('logout')
   @UseGuards(JwtCookieGuard)
   @HttpCode(204)
   async logout(@CurrentUserId() cookie: RefreshCookieInputModel): Promise<void> {
      const result = await this.commandBus.execute(new DeviceDeleteCommand(cookie.userId, cookie.deviceId))
      if (result.status === ResultStatus.NOT_FOUND) throw new HttpException(`User or session not found`, HttpStatus.NOT_FOUND)
      if (result.status === ResultStatus.FORBIDDEN) throw new HttpException(`Forbidden`, HttpStatus.FORBIDDEN)
      if (result.status === ResultStatus.SUCCESS) return
      throw new HttpException(`Something went wrong`, HttpStatus.INTERNAL_SERVER_ERROR)
   }

   @Post('refresh-token')
   @UseGuards(JwtCookieGuard)
   @HttpCode(200)
   async refreshToken(@Res({ passthrough: true }) res: Response, @CurrentUserId() cookie: RefreshCookieInputModel): Promise<{ accessToken: string }> {
      const result = await this.commandBus.execute(new RefreshTokensCommand(cookie.deviceId));
      if (result.status !== ResultStatus.SUCCESS) throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
      res.cookie('refreshToken', result.data.refreshToken, { httpOnly: true, secure: true });
      return { accessToken: result.data.accessToken }
   }
}
