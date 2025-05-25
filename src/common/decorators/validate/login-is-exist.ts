import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersQueryRepository } from '../../../features/users/infrastructure';

@ValidatorConstraint({ name: 'LoginIsExist', async: true })
@Injectable()
export class LoginIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userQueryRepo: UsersQueryRepository) {}

  public async validate(value: any): Promise<boolean> {
    if (typeof value !== 'string') return false;

    const user = await this.userQueryRepo.findByUniqueField('login', value);

    return !user;
  }

  public defaultMessage(validationArguments?: ValidationArguments): string {
    if (typeof validationArguments?.value === 'string') {
      return `Login ${validationArguments.value} already exist`;
    }

    return 'Login already exist';
  }
}

export const LoginIsExist = (property?: string, validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: LoginIsExistConstraint,
    });
  };
};
