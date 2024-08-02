import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersQueryRepo, UsersRepo } from '../infrastructure';

@Injectable()
export class UsersService {
  constructor(
    private usersQueryRepo: UsersQueryRepo,
    private usersRepo: UsersRepo,
  ) {}

  public async isUserExist(
    id: string,
    exception: 'notFound' | 'unauthorized' = 'notFound',
  ) {
    const user = await this.usersQueryRepo.findById(id);

    // TODO add interlayer
    const exceptions = {
      notFound: NotFoundException,
      unauthorized: UnauthorizedException,
    };

    if (!user) throw new exceptions[exception]();

    return user;
  }

  public async dropTable() {
    return this.usersRepo.dropTable();
  }
}
