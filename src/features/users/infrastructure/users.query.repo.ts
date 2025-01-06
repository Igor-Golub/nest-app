import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserViewModel } from '../api/models/output';
import { UserViewMapperManager } from '../api/mappers';
import { GetUsersQueryParams } from '../api/models/input';
import { PaginatedViewDto } from '../../../common/dto/base.paginated.view-dto';
import { User } from '../domain/user.entity';

@Injectable()
export class UsersQueryRepo {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  public async findWithPagination(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewModel[]>> {
    const offset = (query.pageNumber - 1) * query.pageSize;

    const [users, totalCount] = await this.repository.findAndCount({
      order: {
        [query.sortBy]: query.sortDirection,
      },
      take: query.pageSize,
      skip: offset,
      where: {
        login: Like(`%${query.searchLoginTerm}%`),
        email: Like(`%${query.searchEmailTerm}%`),
      },
    });

    return PaginatedViewDto.mapToView({
      totalCount,
      size: query.pageSize,
      page: query.pageNumber,
      items: users.map(UserViewMapperManager.mapUsersToView),
    });
  }

  public async findById(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }

  public async findByFields(
    options: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ) {
    return this.repository.findOne({
      where: options,
    });
  }
}
