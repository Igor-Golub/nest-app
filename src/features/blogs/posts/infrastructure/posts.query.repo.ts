import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { PostsQueryParams } from '../api/models/input';
import { PostsViewMapperManager } from '../api/mappers';
import { PaginatedViewDto } from '../../../../common/dto/base.paginated.view-dto';
import { PostLike } from '../domain/postLikes.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly likeRepository: Repository<PostLike>,
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

  public async findPostLikes(id: string) {
    return this.likeRepository.find({
      where: {
        postId: id,
      },
      relations: {
        owner: true,
      },
      order: {
        createdAt: 'desc',
      },
    });
  }

  public async getWithPagination(
    query: PostsQueryParams,
    userId: string | undefined,
    blogId: string | undefined = undefined,
  ) {
    console.log('userId', userId);
    const offset = (query.pageNumber - 1) * query.pageSize;

    const builder = this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.blog', 'blog');

    if (blogId) {
      builder.where('p.blogId = :blogId', { blogId });
    }

    const [posts, totalCount] = await builder
      .orderBy(`p.${query.sortBy}`, query.sortDirection)
      .take(query.pageSize)
      .skip(offset)
      .getManyAndCount();

    const likes = await this.likeRepository.find({
      where: {
        postId: In(posts.map(({ id }) => id)),
      },
      relations: {
        owner: true,
      },
      order: {
        createdAt: 'desc',
      },
    });

    return PaginatedViewDto.mapToView({
      totalCount,
      items: posts.map((post) =>
        PostsViewMapperManager.mapPostsToViewModelWithLikes(
          post,
          likes,
          userId,
        ),
      ),
      size: query.pageSize,
      page: query.pageNumber,
    });
  }
}
