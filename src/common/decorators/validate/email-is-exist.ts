import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersQueryRepository } from '../../../features/users/infrastructure';

@ValidatorConstraint({ name: 'EmailIsExist', async: true })
@Injectable()
export class EmailIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userQueryRepo: UsersQueryRepository) {}

  public async validate(value: any): Promise<boolean> {
    if (typeof value !== 'string') return false;

    const user = await this.userQueryRepo.findByFields({ email: value });

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
