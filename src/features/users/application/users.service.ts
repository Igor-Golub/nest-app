import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersQueryRepo } from '../infrastructure';

@Injectable()
export class UsersService {
  constructor(private usersQueryRepo: UsersQueryRepo) {}

  public async isUserExist(
    id: string,
    exception: 'notFound' | 'unauthorized' = 'notFound',
  ) {
    const user = await this.usersQueryRepo.getById(id);

    const exceptions = {
      notFound: NotFoundException,
      unauthorized: UnauthorizedException,
    };

    if (!user) throw new exceptions[exception]();

    return user;
  }
}
