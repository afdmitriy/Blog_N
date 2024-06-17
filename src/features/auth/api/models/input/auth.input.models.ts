import { IsEmail, Length } from "class-validator";
import { Trim } from "src/infrastructure/decorators/transform/trim.decorator";

export class ValidationCodeModel {
   @Trim()
   code: string;
}

export class EmailResendingModel {
   @Trim()
   @IsEmail()
   email: string;
}

export class NewPasswordModel {
   @Trim()
   @Length(6, 20)
   newPassword: string;
   @Trim()
   recoveryCode: string
}