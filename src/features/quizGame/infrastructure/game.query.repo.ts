import { Injectable } from '@nestjs/common';

@Injectable()
export class GameQueryRepo {
  constructor() {}

  public async findById(id: string) {
    return null;
  }
}
