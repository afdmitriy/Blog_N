import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { jwtConstants } from '../constants/constants';
import { UserRepository } from '../../features/users/infrastructure/user.typeOrm.repository';

@Injectable()
export class PayloadFromJwtMiddleware implements NestMiddleware {
   constructor(
      private jwtService: JwtService,
      @Inject(UserRepository.name) private readonly userRepository: UserRepository,
   ) { }

   async use(req: Request, res: Response, next: NextFunction) {
      const authHeader = req.headers.authorization;
      if (authHeader) {
         const token = authHeader.split(' ')[1]; // Bearer <token>
         try {
            const payload = this.jwtService.verify(token, {secret: jwtConstants.secretAccess});
            const user = await this.userRepository.getById(payload.userId);
            if (!user) {
               req.user = undefined
               return;
            }
            req.user = payload.userId
         } catch (e) {
            req.user = undefined;
         }
      } else {
         req.user = undefined
      }

      next();
   }
}