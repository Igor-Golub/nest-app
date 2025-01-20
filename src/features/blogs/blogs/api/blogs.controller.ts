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
import { BlogsQueryRepository } from '../infrastructure';
import {
  BlogsQueryDtoParams,
  UpdateBlogParams,
  UpdateBlogDto,
  BlogsQueryDto,
  CreateBlogDto,
  CreatePostForBlogDto,
  DeleteBlogParams,
  CreatePostForBlogParams,
} from './models/input';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateBlogCommand,
  DeleteBlogCommand,
  UpdateBlogCommand,
  CreatePostForBlogCommand,
} from '../application';
import { BlogsViewMapperManager } from './mappers';
import { PostsViewMapperManager } from '../../posts/api/mappers';
import { BasicAuthGuard } from '../../../auth/guards';
import { UserIdFromAccessToken } from '../../../../common/pipes';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query.repo';

@Controller('sa/blogs')
export class BlogsController {
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
    const command = new CreateBlogCommand({
      userId: '09c23e56-5bd8-400d-8fbb-5599f8fad4a5',
      ...createBlogDto,
    });

    const { id } = await this.commandBus.execute<
      CreateBlogCommand,
      { id: string }
    >(command);

    const blog = await this.blogsQueryRepo.findById(id);

    if (!blog) throw new NotFoundException();

    return BlogsViewMapperManager.mapBlogsToViewModel(blog);
  }

  @Get(':id/posts')
  public async getPostsOfBlog(
    @UserIdFromAccessToken() userId: string | undefined,
    @Param('id') blogId: string,
    @Query() query: any,
  ) {
    const blog = await this.blogsQueryRepo.findById(blogId);

    if (!blog) throw new NotFoundException();

    const posts = await this.postsQueryRepository.getWithPagination(query);

    return {
      ...posts,
      items: PostsViewMapperManager.mapPostsToViewModelWithLikes(
        posts.items,
        userId,
      ),
    };
  }

  @Post(':id/posts')
  @UseGuards(BasicAuthGuard)
  public async createPostForBlog(
    @UserIdFromAccessToken() userId: string | undefined,
    @Param() { id: blogId }: CreatePostForBlogParams,
    @Body() createCommentDto: CreatePostForBlogDto,
  ) {
    const blog = await this.blogsQueryRepo.findById(blogId);

    if (!blog || !userId) throw new NotFoundException();

    const command = new CreatePostForBlogCommand({
      userId,
      blogId,
      blogName: blog.name,
      createData: createCommentDto,
    });

    const createdPostId = await this.commandBus.execute(command);

    const newPost = await this.postsQueryRepository.findById(createdPostId);

    return PostsViewMapperManager.addDefaultLikesData(newPost);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @Param() { id }: UpdateBlogParams,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    const blog = await this.blogsQueryRepo.findById(id);

    if (!blog) throw new NotFoundException();

    const command = new UpdateBlogCommand({ id, updateData: updateBlogDto });

    return this.commandBus.execute<UpdateBlogCommand, boolean>(command);
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
