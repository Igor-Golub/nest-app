import { Injectable } from '@nestjs/common';
import { PaginationService } from '../../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../../infrastructure/services/filter.service';
import { UserQueryRepo } from './interfaces';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserDBEntity, UserEntity } from '../domain/userEntity';

@Injectable()
export class UsersQueryRepo implements UserQueryRepo {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Blog>,
  ) {}

  public async findWithPagination() {
    //TODO add query
    return [];
  }

  public async findById(id: string): Promise<UserDBEntity | null> {
    return this.dataSource.query(
      `
        select *
        from "user" as u
        where u."id" = ${id}
    `,
    );
  }

  public async findByField<key extends keyof UserEntity>(
    field: key,
    value: UserEntity[key],
  ): Promise<UserDBEntity | null> {
    const queryResult = await this.dataSource.query<UserDBEntity[]>(
      `
        select *
        from "user" as u
        where u."${field}" = '${value}'
    `,
    );

    return queryResult.length ? queryResult[0] : null;
  }

  public async findByFields<key extends keyof UserEntity>(
    fields: key[],
    value: UserEntity[key],
  ): Promise<UserDBEntity | null> {
    const queryResult = await this.dataSource.query<UserDBEntity[]>(
      `
        select *
        from "user" as u
        where ${value} in ${fields.join(', ')}
    `,
    );

    return queryResult.length ? queryResult[0] : null;
  }
}
