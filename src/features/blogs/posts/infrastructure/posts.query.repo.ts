import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { Repository } from 'typeorm';
import { PostsQueryParams } from '../api/models/input';
import { PaginatedViewDto } from '../../../../common/dto/base.paginated.view-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
  ) {}

  public async findById(id: string) {
    return this.repository
      .createQueryBuilder()
      .from(Post, 'p')
      .where('p.id = :id', { id })
      .getOne();
  }

  public async getWithPagination(query: PostsQueryParams) {
    const offset = (query.pageNumber - 1) * query.pageSize;

    const [posts, totalCount] = await this.repository.findAndCount({
      order: {
        [query.sortBy]: query.sortDirection,
      },
      take: query.pageSize,
      skip: offset,
    });

    return PaginatedViewDto.mapToView({
      totalCount,
      size: query.pageSize,
      page: query.pageNumber,
      items: posts,
    });
  }
}
