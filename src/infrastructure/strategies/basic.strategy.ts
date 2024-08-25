import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { BasicStrategy as Strategy } from 'passport-http'
import { basicConstants } from "../constants/constants";

Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {

   constructor() {
      super()
   }

   async validate(username: string, password: string) {
      if(username === basicConstants.loginSa && password === basicConstants.passwordSa) return true
      throw new UnauthorizedException()
   }
}