import { HttpStatus } from '@nestjs/common';

export class RepositoryError extends Error {
  constructor(
    message: string,
    public httpStatus: HttpStatus = HttpStatus.NOT_FOUND,
    public meta?: string,
  ) {
    super(message);
  }
}
