import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule} from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { LocalStrategy } from 'src/infrastructure/strategies/local.strategy';
import { JwtStrategy } from 'src/infrastructure/strategies/jwt.strategy';
import { JwtCookieStrategy } from 'src/infrastructure/strategies/jwt.cookie.strategy';
import { MailModule } from 'src/infrastructure/adapters/mailer/mail.module';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from 'src/infrastructure/constants/constants';
import { UserRegistrationUseCase } from './application/use-cases/registrate-user.use-case';
import { UserLoginUseCase } from './application/use-cases/login-user.use-case';

// const guards = [BasicAuthGuard, LocalAuthGuard, JwtAuthGuard, JwtCookieGuard]
const strategies = [LocalStrategy, JwtStrategy, JwtCookieStrategy]


@Module({
  imports: [CqrsModule, UsersModule, MailModule, PassportModule,
    JwtModule.register({
      secret: jwtConstants.secretAccess,
      // Здесь возможна ошибка типа передающегося в константе

      signOptions: { expiresIn: (jwtConstants.accessExpiresIn) },
    }),
  ],
  controllers: [AuthController],
  providers: [ ...strategies, AuthService, UserRegistrationUseCase, UserLoginUseCase, ],
  // exports: [AuthService]
})
export class AuthModule {
}