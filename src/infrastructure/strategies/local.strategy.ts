import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
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
      if (userId.status !== ResultStatus.SUCCESS) throw new HttpException('login or password not valid', HttpStatus.UNAUTHORIZED)
      // Важно не передавать лишнюю инфу. Id достаточно
      // этот userId передается дальше в request
      
      return userId.data!.userId;
   }
}