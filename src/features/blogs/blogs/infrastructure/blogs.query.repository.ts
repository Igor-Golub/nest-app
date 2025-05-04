import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../domain/blog.entity';
import { BlogsQueryDto } from '../api/models/input';
import { BlogsViewMapperManager } from '../api/mappers';
import { PaginatedViewDto } from '../../../../common/dto/base.paginated.view-dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  public async isBlogExist(postId: string): Promise<boolean> {
    const amount = await this.blogRepository.count({ where: { id: postId } });
    return Boolean(amount);
  }

  public async getWithPagination(query: BlogsQueryDto) {
    const [blogs, totalCount] = await this.blogRepository.findAndCount({
      order: {
        [query.sortBy]: query.sortDirection,
      },
      take: query.pageSize,
      skip: (query.pageNumber - 1) * query.pageSize,
      where: {
        name: ILike(`%${query.searchNameTerm ?? ''}%`),
      },
    });

    return PaginatedViewDto.mapToView({
      totalCount,
      size: query.pageSize,
      page: query.pageNumber,
      items: blogs.map(BlogsViewMapperManager.mapBlogsToViewModel),
    });
  }

  public async findById(id: string) {
    return this.blogRepository.findOneBy({ id });
  }
}
