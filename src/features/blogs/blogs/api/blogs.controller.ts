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
import { BlogsQueryRepo } from '../infrastructure';
import {
  PostsLikesQueryRepo,
  PostsQueryRepo,
} from '../../posts/infrastructure';
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
import { PostsService } from '../../posts/application/posts.service';
import { BasicAuthGuard } from '../../../auth/guards';
import { UserIdFromAccessToken } from '../../../../common/pipes';

@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private readonly blogsQueryRepo: BlogsQueryRepo,
    private readonly postsQueryRepo: PostsQueryRepo,
    private readonly postsService: PostsService,
    private readonly postsLikesQueryRepo: PostsLikesQueryRepo,
  ) {}

  @Get()
  public async getAll(@Query() query: BlogsQueryDto) {
    const data = await this.blogsQueryRepo.getWithPagination();

    return {
      ...data,
      items: data.items.map(BlogsViewMapperManager.mapBlogsToViewModel),
    };
  }

  @Get(':id')
  public async getById(@Param() { id }: BlogsQueryDtoParams) {
    const blog = await this.blogsQueryRepo.getById(id);

    if (!blog) throw new NotFoundException();

    return BlogsViewMapperManager.mapBlogsToViewModel(blog);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  public async create(@Body() createBlogDto: CreateBlogDto) {
    const command = new CreateBlogCommand(createBlogDto);

    const { id } = await this.commandBus.execute(command);

    const blog = await this.blogsQueryRepo.getById(id);

    return BlogsViewMapperManager.mapBlogsToViewModel(blog);
  }

  @Get(':id/posts')
  public async getPostsOfBlog(
    @UserIdFromAccessToken() userId: string | undefined,
    @Param('id') blogId: string,
    @Query() query: Api.CommonQuery,
  ) {
    const blog = await this.blogsQueryRepo.getById(blogId);

    if (!blog) throw new NotFoundException();

    const posts = await this.postsQueryRepo.getWithPagination();

    const postsLikesIds = this.postsService.getPostsIds(posts.items);

    const postLikes =
      await this.postsLikesQueryRepo.findLikesByIds(postsLikesIds);

    return {
      ...posts,
      items: PostsViewMapperManager.mapPostsToViewModelWithLikes(
        posts.items,
        postLikes,
        userId,
      ),
    };
  }

  @Post(':id/posts')
  @UseGuards(BasicAuthGuard)
  public async createPostForBlog(
    @Param() { id: blogId }: CreatePostForBlogParams,
    @Body() createCommentDto: CreatePostForBlogDto,
  ) {
    const blog = await this.blogsQueryRepo.getById(blogId);

    if (!blog) throw new NotFoundException();

    const command = new CreatePostForBlogCommand({
      blogId,
      blogName: blog.name,
      createData: createCommentDto,
    });

    const createdPostId = await this.commandBus.execute(command);

    const newPost = await this.postsQueryRepo.getById(createdPostId);

    return PostsViewMapperManager.addDefaultLikesData(newPost);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @Param() { id }: UpdateBlogParams,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    const command = new UpdateBlogCommand({ id, updateData: updateBlogDto });

    const result = await this.commandBus.execute(command);

    if (!result) throw new NotFoundException();

    return result;
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param()
    { id }: DeleteBlogParams,
  ) {
    const command = new DeleteBlogCommand({ id });

    const result = await this.commandBus.execute(command);

    if (!result) throw new NotFoundException();

    return true;
  }
}
