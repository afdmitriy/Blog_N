import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../../features/auth/application/auth.service";
import { Strategy } from "passport-local";
import { ResultStatus } from "src/base/models/enums/enums";

Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

   constructor(private authService: AuthService) {
      super({
         usernameField: 'loginOrEmail'
      })
      
   }
   
   async validate(loginOrEmail: string, password: string): Promise<string> {
      console.log(this.authService)
      console.log('LocalStrategy Validate 1')
      
      const userId = await this.authService.validateUser(loginOrEmail, password);
      if (userId.status !== ResultStatus.SUCCESS) {
         throw new UnauthorizedException();
      }

      // Важно не передавать лишнюю инфу. Id достаточно
      // этот userId передается дальше в request
      return userId.data!.userId;
   }
}