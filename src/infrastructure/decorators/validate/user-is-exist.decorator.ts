/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */
import { Inject, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from '../../../features/users/infrastructure/user.repository';



export function NameIsExist(property?: string, validationOptions?: ValidationOptions) {
  
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: NameIsExistConstraint,
    });
  };
}

// Обязательна регистрация в ioc
@ValidatorConstraint({ name: 'NameIsExist', async: false })
@Injectable()
export class NameIsExistConstraint implements ValidatorConstraintInterface {
  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(value: any, args: ValidationArguments) {
    const nameIsExist = await this.userRepository.getUserByLoginOrEmail(value);
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return !!!nameIsExist;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Name already exist';
  }
}