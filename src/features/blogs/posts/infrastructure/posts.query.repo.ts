import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { PostsQueryParams } from '../api/models/input';
import { PostLike } from '../domain/postLikes.entity';
import { LikeStatus } from '../../../../common/enums';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
    @InjectRepository(PostLike)
    private readonly likeRepository: Repository<PostLike>,
  ) {}

  public async isPostExist(postId: string): Promise<boolean> {
    const amount = await this.repository.count({ where: { id: postId } });
    return Boolean(amount);
  }

  public async findById(id: string) {
    return this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.blog', 'blog')
      .leftJoinAndSelect('p.likes', 'likes')
      .leftJoinAndSelect('likes.owner', 'owner')
      .where('p.id = :id', { id })
      .orderBy('likes.createdAt', 'DESC')
      .getOne();
  }

  public async getWithPagination(
    query: PostsQueryParams,
    userId: string | undefined,
    blogId: string | undefined = undefined,
  ) {
    const offset = (query.pageNumber - 1) * query.pageSize;

    const builder = this.repository.createQueryBuilder('p').leftJoinAndSelect('p.blog', 'blog');

    if (blogId) {
      builder.where('p.blogId = :blogId', { blogId });
    }

    const [posts, totalCount] = await builder
      .orderBy(query.sortBy === 'blogName' ? 'blog.name' : `p.${query.sortBy}`, query.sortDirection)
      .take(query.pageSize)
      .skip(offset)
      .getManyAndCount();

    if (posts.length === 0) {
      return {
        pagesCount: 0,
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount: 0,
        items: [],
      };
    }

    const postIds = posts.map((p) => p.id);

    const likes = await this.likeRepository.find({
      where: { postId: In(postIds) },
      relations: { owner: true },
      order: { createdAt: 'desc' },
    });

    const likesByPostId = new Map<string, PostLike[]>();

    for (const like of likes) {
      const arr = likesByPostId.get(like.postId) ?? [];
      arr.push(like);
      likesByPostId.set(like.postId, arr);
    }

    const items = posts.map((post) => {
      const postLikes = likesByPostId.get(post.id) ?? [];

      const likesCount = postLikes.filter((l) => l.status === LikeStatus.Like).length;

      const dislikesCount = postLikes.filter((l) => l.status === LikeStatus.Dislike).length;

      const myStatus = postLikes.find(({ ownerId }) => ownerId === userId)?.status ?? LikeStatus.None;

      const newestLikes = postLikes
        .filter(({ status }) => status === LikeStatus.Like)
        .slice(0, 3)
        .map(({ createdAt, ownerId, owner }) => ({
          userId: ownerId,
          login: owner.login,
          addedAt: createdAt.toISOString(),
        }));

      return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blog.name,
        createdAt: post.createdAt.toISOString(),
        extendedLikesInfo: { likesCount, dislikesCount, myStatus, newestLikes },
      };
    });

    return {
      items,
      totalCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      pagesCount: Math.ceil(totalCount / query.pageSize),
    };
  }
}
