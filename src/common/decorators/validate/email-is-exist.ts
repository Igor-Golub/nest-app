import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersQueryRepo } from '../../../features/users/infrastructure/users.query.repo';

@ValidatorConstraint({ name: 'EmailIsExist', async: true })
@Injectable()
export class EmailIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userQueryRepo: UsersQueryRepo) {}

  public async validate(value: any): Promise<boolean> {
    if (typeof value !== 'string') return false;

    const user = await this.userQueryRepo.emailIsExist(value);

    return !user;
  }

  public defaultMessage(validationArguments?: ValidationArguments): string {
    if (typeof validationArguments?.value === 'string') {
      return `Email ${validationArguments.value} already exist`;
    }

    return 'Email already exist';
  }
}

export const EmailIsExist = (
  property?: string,
  validationOptions?: ValidationOptions,
) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: EmailIsExistConstraint,
    });
  };
};
