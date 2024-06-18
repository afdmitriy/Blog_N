import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../../features/auth/application/auth.service";
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { ResultStatus } from "../../base/models/enums/enums";

Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

   constructor(@Inject(AuthService.name) private authService: AuthService) {
      super({
         usernameField: 'loginOrEmail'
      })
      
   }
   
   async validate(loginOrEmail: string, password: string): Promise<string> {
      const userId = await this.authService.validateUser(loginOrEmail, password);
      if (userId.status !== ResultStatus.SUCCESS) {
         throw new UnauthorizedException();
      }
      console.log('LocalStrategy', userId.data!.userId)
      // Важно не передавать лишнюю инфу. Id достаточно
      // этот userId передается дальше в request
      
      return userId.data!.userId;
   }
}