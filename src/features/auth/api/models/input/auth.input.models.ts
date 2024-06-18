import { IsEmail, Length } from "class-validator";

import { ConfCodeIsValid } from "../../../../../infrastructure/decorators/validate/confirmation-code.decorator";
import { EmailIsConfirmed } from "../../../../../infrastructure/decorators/validate/email-is-confirmed.decorator";
import { Trim } from "../../../../../infrastructure/decorators/transform/trim.decorator";

export class ValidationCodeModel {
   @Trim()
   @ConfCodeIsValid()
   code: string;
}

export class EmailResendingModel {
   @Trim()
   @IsEmail()
   @EmailIsConfirmed()
   email: string;
 }


export class NewPasswordModel {
   @Trim()
   @Length(6, 20)
   newPassword: string;
   @Trim()
   recoveryCode: string
}