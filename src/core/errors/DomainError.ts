import { HttpStatus } from '@nestjs/common';

export class DomainError extends Error {
  constructor(
    message: string,
    private httpStatus: HttpStatus,
    private meta?: string,
  ) {
    super(message);
  }
}
