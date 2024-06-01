import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/createPostDto';
import { PostsRepo } from './posts.repo';
import { BlogsQueryRepo } from '../blogs/blogs.query.repo';
import { UpdatePostDto } from './dto/updatePostDto';
import { LikeStatus } from '../../enums/Common';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepo: PostsRepo,
    private readonly blogsQueryRepo: BlogsQueryRepo,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    const blog = await this.blogsQueryRepo.getById(createPostDto.blogId);

    if (!blog) throw new NotFoundException();

    const { _id, id, title, shortDescription, content } =
      await this.postsRepo.create({ blogName: blog.name, ...createPostDto });

    const newPost: ViewModels.PostWithFullLikes = {
      id,
      title,
      content,
      createdAt: _id._id.getTimestamp().toISOString(),
      shortDescription,
      blogId: blog.id,
      blogName: blog.name,
      extendedLikesInfo: {
        myStatus: LikeStatus.None,
        likesCount: 0,
        dislikesCount: 0,
        newestLikes: [],
      },
    };

    return newPost;
  }

  public async update(id: string, updatePostDto: UpdatePostDto) {
    const result = await this.postsRepo.update(id, updatePostDto);

    if (!result) throw new NotFoundException();

    return true;
  }

  public async delete(id: string) {
    const result = await this.postsRepo.delete(id);

    if (!result) throw new NotFoundException();

    return true;
  }
}
