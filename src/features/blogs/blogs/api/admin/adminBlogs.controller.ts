import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../../infrastructure';
import {
  BlogsQueryDtoParams,
  UpdateBlogParams,
  UpdateBlogDto,
  BlogsQueryDto,
  CreateBlogDto,
  CreatePostForBlogDto,
  DeleteBlogParams,
  CreatePostForBlogParams,
} from '../models/input';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateBlogCommand,
  DeleteBlogCommand,
  UpdateBlogCommand,
  CreatePostForBlogCommand,
} from '../../application';
import { BlogsViewMapperManager } from '../mappers';
import { PostsViewMapperManager } from '../../../posts/api/mappers';
import { BasicAuthGuard } from '../../../../auth/guards';
import { UserIdFromAccessToken } from '../../../../../common/pipes';
import { PostsQueryRepository } from '../../../posts/infrastructure/posts.query.repo';
import { PostsQueryParams } from '../../../posts/api/models/input';
import { Blog } from '../../domain/blog.entity';
import { Post as PostEntity } from '../../../posts/domain/post.entity';

@Controller('sa/blogs')
export class AdminBlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  public async getAll(@Query() query: BlogsQueryDto) {
    return this.blogsQueryRepo.getWithPagination(query);
  }

  @Get(':id')
  public async getById(@Param() { id }: BlogsQueryDtoParams) {
    const blog = await this.blogsQueryRepo.findById(id);

    if (!blog) throw new NotFoundException();

    return BlogsViewMapperManager.mapBlogsToViewModel(blog);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  public async create(@Body() createBlogDto: CreateBlogDto) {
    const command = new CreateBlogCommand(createBlogDto);

    const blog = await this.commandBus.execute<CreateBlogCommand, Blog>(
      command,
    );

    if (!blog) throw new NotFoundException();

    return BlogsViewMapperManager.mapBlogsToViewModel(blog);
  }

  @Get(':id/posts')
  public async getPostsOfBlog(
    @UserIdFromAccessToken() userId: string | undefined,
    @Param('id') blogId: string,
    @Query() query: PostsQueryParams,
  ) {
    const blog = await this.blogsQueryRepo.findById(blogId);

    if (!blog) throw new NotFoundException();

    return this.postsQueryRepository.getWithPagination(query, userId);
  }

  @Post(':id/posts')
  @UseGuards(BasicAuthGuard)
  public async createPostForBlog(
    @Param() { id: blogId }: CreatePostForBlogParams,
    @Body() createData: CreatePostForBlogDto,
  ) {
    const blog = await this.blogsQueryRepo.findById(blogId);

    if (!blog) throw new NotFoundException();

    const command = new CreatePostForBlogCommand({
      blogId,
      blogName: blog.name,
      createData,
    });

    const createdPost = await this.commandBus.execute<
      CreatePostForBlogCommand,
      PostEntity
    >(command);

    if (!createdPost) throw new NotFoundException();

    return PostsViewMapperManager.addDefaultLikesData(createdPost);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @Param() { id }: UpdateBlogParams,
    @Body() updateData: UpdateBlogDto,
  ) {
    const blog = await this.blogsQueryRepo.findById(id);

    if (!blog) throw new NotFoundException();

    const command = new UpdateBlogCommand({ id, updateData });

    const updatedBlog = this.commandBus.execute<UpdateBlogCommand, Blog | null>(
      command,
    );

    if (!updatedBlog) throw new NotFoundException();

    return updatedBlog;
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param()
    { id }: DeleteBlogParams,
  ) {
    const blog = await this.blogsQueryRepo.findById(id);

    if (!blog) throw new NotFoundException();

    const command = new DeleteBlogCommand({ id });

    return this.commandBus.execute<DeleteBlogCommand, boolean>(command);
  }
}
