import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/createBlogDto';
import { UpdateBlogDto } from './dto/updateBlogDto';
import { BlogsRepo } from './blogs.repo';
import { PostsService } from '../posts/posts.service';
import { CreateCommentDto } from '../comments/dto/createCommentDto';
import { CreatePostDto } from '../posts/dto/createPostDto';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepo: BlogsRepo,
    private readonly postsService: PostsService,
  ) {}

  public async findById(id: string) {
    return this.blogsRepo.findById(id);
  }

  public async create(createBlogDto: CreateBlogDto) {
    const { id, createdAt, isMembership, websiteUrl, description, name } =
      await this.blogsRepo.create(createBlogDto);

    const newEntity: ViewModels.Blog = {
      id,
      name,
      createdAt,
      websiteUrl,
      description,
      isMembership,
    };

    return newEntity;
  }

  public async update(id: string, updateBlogDto: UpdateBlogDto) {
    const result = await this.blogsRepo.update(id, updateBlogDto);

    if (!result) throw new NotFoundException();

    return result;
  }

  public async delete(id: string) {
    const result = await this.blogsRepo.delete(id);

    if (!result) throw new NotFoundException();

    return true;
  }

  public async createPostForBlog(
    blogId: string,
    dto: Omit<CreatePostDto, 'blogId'>,
  ) {
    return await this.postsService.create({ blogId, ...dto });
  }
}
