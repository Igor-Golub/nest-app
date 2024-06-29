import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersQueryRepo } from '../../../features/users/infrastructure/users.query.repo';

@ValidatorConstraint({ name: 'LoginIsExist', async: true })
@Injectable()
export class LoginIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userQueryRepo: UsersQueryRepo) {}

  public async validate(value: any): Promise<boolean> {
    if (typeof value !== 'string') return false;

    const user = await this.userQueryRepo.loginIsExist(value);

    return !user;
  }

  public defaultMessage(validationArguments?: ValidationArguments): string {
    if (typeof validationArguments?.value === 'string') {
      return `Login ${validationArguments.value} already exist`;
    }

    return 'Login already exist';
  }
}

export const LoginIsExist = (
  property?: string,
  validationOptions?: ValidationOptions,
) => {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: LoginIsExistConstraint,
    });
  };
};
