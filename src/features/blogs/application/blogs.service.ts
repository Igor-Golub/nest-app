import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from '../api/models/input/createBlogDto';
import { UpdateBlogDto } from '../api/models/input/updateBlogDto';
import { BlogsRepo } from '../infrastructure/blogs.repo';
import { PostsService } from '../../posts/application/posts.service';
import { CreatePostDto } from '../../posts/api/models/input/createPostDto';

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
    const { id, _id, isMembership, websiteUrl, description, name } =
      await this.blogsRepo.create(createBlogDto);

    const newEntity: ViewModels.Blog = {
      id,
      name,
      websiteUrl,
      description,
      isMembership,
      createdAt: _id._id.getTimestamp().toISOString(),
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
