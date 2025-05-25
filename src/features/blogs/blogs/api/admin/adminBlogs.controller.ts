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
  DeleteBlogParams,
  CreateBlogPostDto,
  UpdateBlogPostDto,
  CreateBlogPostParams,
  DeleteBlogPostParams,
  UpdateBlogPostParams,
} from '../models/input';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateBlogCommand,
  DeleteBlogCommand,
  UpdateBlogCommand,
  CreateBlogPostCommand,
  UpdateBlogPostCommand,
  DeleteBlogPostCommand,
} from '../../application';
import { BlogsViewMapperManager } from '../mappers';
import { PostsViewMapperManager } from '../../../posts/api/mappers';
import { BasicAuthGuard } from '../../../../auth/guards';
import { UserIdFromAccessToken } from '../../../../../common/pipes';
import { PostsQueryRepository } from '../../../posts/infrastructure/posts.query.repo';
import { PostsQueryParams } from '../../../posts/api/models/input';
import { Blog } from '../../domain/blog.entity';

@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class AdminBlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  public async getAllBlogs(@Query() query: BlogsQueryDto) {
    return this.blogsQueryRepo.getWithPagination(query);
  }

  @Get(':blogId')
  public async getBlogById(@Param() { blogId }: BlogsQueryDtoParams) {
    const blog = await this.blogsQueryRepo.findById(blogId);

    if (!blog) throw new NotFoundException();

    return BlogsViewMapperManager.mapBlogsToViewModel(blog);
  }

  @Post()
  public async createBlog(@Body() createBlogDto: CreateBlogDto) {
    const command = new CreateBlogCommand(createBlogDto);

    const blog = await this.commandBus.execute<CreateBlogCommand, Blog>(command);

    if (!blog) throw new NotFoundException();

    return BlogsViewMapperManager.mapBlogsToViewModel(blog);
  }

  @Put(':blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updateBlog(@Param() { blogId }: UpdateBlogParams, @Body() updateData: UpdateBlogDto) {
    const isBlogExist = await this.blogsQueryRepo.isBlogExist(blogId);

    if (!isBlogExist) throw new NotFoundException();

    const command = new UpdateBlogCommand({ id: blogId, updateData });

    const updatedBlog = this.commandBus.execute<UpdateBlogCommand, Blog | null>(command);

    if (!updatedBlog) throw new NotFoundException();

    return updatedBlog;
  }

  @Delete(':blogId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteBlog(
    @Param()
    { blogId }: DeleteBlogParams,
  ) {
    const isBlogExist = await this.blogsQueryRepo.isBlogExist(blogId);

    if (!isBlogExist) throw new NotFoundException();

    const command = new DeleteBlogCommand({ id: blogId });

    return this.commandBus.execute<DeleteBlogCommand, boolean>(command);
  }

  @Get(':blogId/posts')
  public async getPosts(
    @UserIdFromAccessToken() userId: string | undefined,
    @Param('id') blogId: string,
    @Query() query: PostsQueryParams,
  ) {
    const blog = await this.blogsQueryRepo.findById(blogId);

    if (!blog) throw new NotFoundException();

    return this.postsQueryRepository.getWithPagination(query, userId);
  }

  @Post(':blogId/posts')
  public async createPost(@Param() { blogId }: CreateBlogPostParams, @Body() createDTO: CreateBlogPostDto) {
    const blog = await this.blogsQueryRepo.findById(blogId);

    if (!blog) throw new NotFoundException();

    const command = new CreateBlogPostCommand({
      blogId: blog.id,
      blogName: blog.name,
      createData: createDTO,
    });

    const postId = await this.commandBus.execute<CreateBlogPostCommand, string>(command);

    const post = await this.postsQueryRepository.findById(postId);

    if (!post) throw new NotFoundException();

    return PostsViewMapperManager.addDefaultLikesData(post);
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePost(@Param() { blogId, postId }: UpdateBlogPostParams, @Body() updateDTO: UpdateBlogPostDto) {
    const isBlogExist = await this.blogsQueryRepo.isBlogExist(blogId);
    const isPostExist = await this.postsQueryRepository.isPostExist(postId);

    if (!isBlogExist || !isPostExist) throw new NotFoundException();

    const updateCommand = new UpdateBlogPostCommand({
      blogId,
      postId,
      updateData: updateDTO,
    });

    return this.commandBus.execute<UpdateBlogPostCommand, string>(updateCommand);
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deletePost(@Param() { blogId, postId }: DeleteBlogPostParams) {
    const isBlogExist = await this.blogsQueryRepo.isBlogExist(blogId);
    const isPostExist = await this.postsQueryRepository.isPostExist(postId);

    if (!isBlogExist || !isPostExist) throw new NotFoundException();

    const deleteCommand = new DeleteBlogPostCommand({ postId, blogId });

    return this.commandBus.execute<DeleteBlogPostCommand>(deleteCommand);
  }
}
