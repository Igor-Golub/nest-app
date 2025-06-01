import { HttpStatus } from '@nestjs/common';

export class DomainError extends Error {
  constructor(
    message: string,
    public httpStatus: HttpStatus,
    public meta?: string,
  ) {
    super(message);
  }
}
