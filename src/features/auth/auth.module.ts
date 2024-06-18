import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule} from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { UserRegistrationUseCase } from './application/use-cases/registrate-user.use-case';
import { UserLoginUseCase } from './application/use-cases/login-user.use-case';
import { PasswordRecoveryUseCase } from './application/use-cases/password-recovery.use-case';
import { SetNewPasswordUseCase } from './application/use-cases/new-password.use-case';
import { MailModule } from '../../infrastructure/adapters/mailer/mail.module';
import { LocalStrategy } from '../../infrastructure/strategies/local.strategy';
import { JwtStrategy } from '../../infrastructure/strategies/jwt.strategy';
import { JwtCookieStrategy } from '../../infrastructure/strategies/jwt.cookie.strategy';

// const guards = [BasicAuthGuard, LocalAuthGuard, JwtAuthGuard, JwtCookieGuard]
const strategies = [LocalStrategy, JwtStrategy, JwtCookieStrategy]


@Module({
  imports: [CqrsModule, UsersModule, MailModule, PassportModule,
    JwtModule.register({
      // secret: jwtConstants.secretAccess,
      // // Здесь возможна ошибка типа передающегося в константе

      // signOptions: { expiresIn: (jwtConstants.accessExpiresIn) },
    }),
  ],
  controllers: [AuthController],
  providers: [ {
    provide: AuthService.name,
    useClass: AuthService
  }, 
  ...strategies, AuthService, PasswordRecoveryUseCase, UserRegistrationUseCase, UserLoginUseCase, SetNewPasswordUseCase],
  // exports: [AuthService.name]
})
export class AuthModule {
}