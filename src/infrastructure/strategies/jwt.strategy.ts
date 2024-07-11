import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/constants';
import { UserRepository } from '../../features/users/infrastructure/user.repository';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretAccess,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.getUserById(payload.userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    return payload.userId; 
  }
}