import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsQueryRepo } from '../../../features/blogs/infrastructure';

@ValidatorConstraint({ name: 'BlogIsExist', async: true })
@Injectable()
export class BlogIsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly blogsQueryRepo: BlogsQueryRepo) {}

  public async validate(value: any): Promise<boolean> {
    if (typeof value !== 'string') return false;

    const blog = await this.blogsQueryRepo.getById(value);

    return !!blog;
  }

  public defaultMessage(): string {
    return 'Blog not exist';
  }
}

export const BlogIsExist = (
  property?: string,
  validationOptions?: ValidationOptions,
) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: BlogIsExistConstraint,
    });
  };
};
