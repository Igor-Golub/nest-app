import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../../infrastructure';
import { BlogsQueryDto, BlogsQueryDtoParams } from '../models/input';
import { BlogsViewMapperManager } from '../mappers';
import { UserIdFromAccessToken } from '../../../../../common/pipes';
import { PostsQueryRepository } from '../../../posts/infrastructure/posts.query.repo';
import { PostsQueryParams } from '../../../posts/api/models/input';

@Controller('/blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  public async getAll(@Query() query: BlogsQueryDto) {
    return this.blogsQueryRepo.getWithPagination(query);
  }

  @Get(':blogId')
  public async getById(@Param() { blogId }: BlogsQueryDtoParams) {
    const blog = await this.blogsQueryRepo.findById(blogId);

    if (!blog) throw new NotFoundException();

    return BlogsViewMapperManager.mapBlogsToViewModel(blog);
  }

  @Get(':blogId/posts')
  public async getPostsOfBlog(
    @UserIdFromAccessToken() userId: string | undefined,
    @Param('blogId') blogId: string,
    @Query() query: PostsQueryParams,
  ) {
    const blog = await this.blogsQueryRepo.findById(blogId);

    if (!blog) throw new NotFoundException();

    return this.postsQueryRepository.getWithPagination(query, userId, blogId);
  }
}
