/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */
import { Inject, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from '../../../features/users/infrastructure/user.typeOrm.repository';



export function ConfCodeIsValid(property?: string, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ConfCodeIsValidConstraint,
    });
  };
}

// Обязательна регистрация в ioc
@ValidatorConstraint({ name: 'ConfCodeIsValid', async: false })
@Injectable()
export class ConfCodeIsValidConstraint implements ValidatorConstraintInterface {
  constructor(@Inject(UserRepository.name) private readonly userRepository: UserRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const userWithCode = await this.userRepository.getByConfirmationCode(value);

    if (!userWithCode) return false;

    if (userWithCode.codeExpirationDate < new Date()) return false;

    if (userWithCode.isConfirmed === true) return false;

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'code not valid';
  }
}