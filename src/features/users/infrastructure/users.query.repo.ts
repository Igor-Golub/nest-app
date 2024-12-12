import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserViewModel } from '../api/models/output';
import { UserViewMapperManager } from '../api/mappers';
import { GetUsersQueryParams } from '../api/models/input';
import { UserDBEntity, UserEntity } from '../domain/userEntity';
import { PaginatedViewDto } from '../../../common/dto/base.paginated.view-dto';

@Injectable()
export class UsersQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  public async findWithPagination(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewModel[]>> {
    const {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      searchLoginTerm,
      searchEmailTerm,
    } = query;

    const offset = (pageNumber - 1) * pageSize;

    const usersFromDB = await this.dataSource.query(
      `
        SELECT *
        FROM "user" AS u
        WHERE 
            ($1 IS NULL OR u."login" ILIKE '%' || $1 || '%') AND
            ($2 IS NULL OR u."email" ILIKE '%' || $2 || '%')
        ORDER BY u."${sortBy}" '${sortDirection}'
        LIMIT $3 OFFSET $4;
      `,
      [searchLoginTerm, searchEmailTerm, pageSize, offset],
    );

    const totalCountResult = await this.dataSource.query(
      `
        SELECT COUNT(*)
        FROM "user" AS u
        WHERE 
            ($1 IS NULL OR u."login" ILIKE '%' || $1 || '%') AND
            ($2 IS NULL OR u."email" ILIKE '%' || $2 || '%');
      `,
      [searchLoginTerm, searchEmailTerm],
    );

    return PaginatedViewDto.mapToView({
      size: pageSize,
      page: pageNumber,
      totalCount: parseInt(totalCountResult[0].count, 10),
      items: usersFromDB.map(UserViewMapperManager.mapUsersToView),
    });
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
