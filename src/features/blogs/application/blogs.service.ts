import { Injectable } from '@nestjs/common';
import { UpdateBlogDto, CreateBlogDto } from '../api/models/input';
import { BlogsRepo } from '../infrastructure/blogs.repo';
import { PostsService } from '../../posts/application/posts.service';
import { CreatePostDto } from '../../posts/api/models/input';

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
    return this.blogsRepo.update(id, updateBlogDto);
  }

  public async delete(id: string) {
    return this.blogsRepo.delete(id);
  }

  public async createPostForBlog(
    blogId: string,
    dto: Omit<CreatePostDto, 'blogId'>,
  ) {
    return await this.postsService.create({ blogId, ...dto });
  }
}
