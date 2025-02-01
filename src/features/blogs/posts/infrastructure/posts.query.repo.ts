import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { PostsQueryParams } from '../api/models/input';
import { PostsViewMapperManager } from '../api/mappers';
import { PaginatedViewDto } from '../../../../common/dto/base.paginated.view-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
  ) {}

  public async findById(id: string) {
    return this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.blog', 'blog')
      .leftJoinAndSelect('p.likes', 'likes')
      .leftJoinAndSelect('likes.owner', 'owner')
      .where('p.id = :id', { id })
      .getOne();
  }

  public async getWithPagination(
    query: PostsQueryParams,
    userId: string | undefined,
  ) {
    const offset = (query.pageNumber - 1) * query.pageSize;

    const [posts, totalCount] = await this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.blog', 'blog')
      .leftJoinAndSelect('p.likes', 'likes')
      .leftJoinAndSelect('likes.owner', 'owner')
      .orderBy(`p.${query.sortBy}`, query.sortDirection)
      .take(query.pageSize)
      .skip(offset)
      .getManyAndCount();

    return PaginatedViewDto.mapToView({
      totalCount,
      items: posts.map((post) =>
        PostsViewMapperManager.mapPostsToViewModelWithLikes(post, userId),
      ),
      size: query.pageSize,
      page: query.pageNumber,
    });
  }
}
