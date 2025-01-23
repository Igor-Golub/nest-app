import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserViewMapperManager } from '../api/mappers';
import { GetUsersQueryParams } from '../api/models/input';
import { PaginatedViewDto } from '../../../common/dto/base.paginated.view-dto';
import { User } from '../domain/user.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  public async findWithPagination(query: GetUsersQueryParams) {
    const [users, totalCount] = await this.repository.findAndCount({
      order: {
        [query.sortBy]: query.sortDirection,
      },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
      where: {
        login: Like(`%${query.searchLoginTerm ?? ''}%`),
        email: Like(`%${query.searchEmailTerm ?? ''}%`),
      },
    });

    return PaginatedViewDto.mapToView({
      totalCount,
      size: query.pageSize,
      page: query.pageNumber,
      items: users.map(UserViewMapperManager.mapUsersToView),
    });
  }

  public async findById(id: string) {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }

  public async findByUniqueField<key extends keyof User>(
    field: key,
    value: User[key],
  ) {
    return this.repository
      .createQueryBuilder()
      .where(`${field} = :value`, { value })
      .getOne();
  }

  public async findByEmailOrLogin(value: string) {
    return this.repository.findOne({
      where: [{ login: value }, { email: value }],
    });
  }
}
