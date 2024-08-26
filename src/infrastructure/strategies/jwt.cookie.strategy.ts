import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/constants';
import { AuthService } from '../../features/auth/application/auth.service';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor(@Inject(AuthService.name) private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.['refreshToken'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretRefresh,
    });
  }

  async validate(payload: any) {
    // Наверное стоит проверять айди сессии и дату выпуска этой сессии, если у токена дата сессии раньше чем в бд, то не пропускаю
    const sessionId = await this.authService.sessionIsValid(payload.userId, payload.deviceId, payload.issuedAt);
    if (!sessionId) throw new HttpException('Unautorized', HttpStatus.UNAUTHORIZED)
    return { userId: payload.userId, deviceId: payload.deviceId };
  }
}