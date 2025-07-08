import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { BlogsQueryRepository } from '../../infrastructure';
import { BlogsQueryDto, BlogsQueryDtoParams } from '../models/input';
import { BlogsViewMapperManager } from '../mappers';
import { UserIdFromAccessToken } from '../../../../../common/pipes';
import { PostsQueryRepository } from '../../../posts/infrastructure/posts.query.repo';
import { PostsQueryParams } from '../../../posts/api/models/input';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BlogViewModel } from '../models/output';

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

  @ApiOperation({ summary: 'Get blog by ID' })
  @ApiOkResponse({ description: 'Get blog by ID', type: BlogViewModel })
  @ApiNotFoundResponse({ description: 'Blog not found' })
  @ApiParam({
    name: 'blogId',
    type: 'string',
    required: true,
    description: 'UUID of the uploaded file',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
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
