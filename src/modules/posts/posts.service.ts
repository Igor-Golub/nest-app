import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPostDto';
import { UpdatePostDto } from './dto/updatePostDto';

@Injectable()
export class PostsService {
  private readonly posts: { id: string }[] = [];

  public async findAll() {
    return this.posts;
  }

  public async findById(id: string) {
    return this.posts.find((i) => i.id === id);
  }

  public async create(createPostDto: CreatePostDto) {
    const newPost = {
      ...createPostDto,
      id: Date.now().toString(),
    };

    this.posts.push(newPost);

    return newPost;
  }

  public async update(id: string, updatePostDto: UpdatePostDto) {
    return this.posts.map((i) =>
      i.id === id
        ? {
            id: id,
            updatePostDto,
          }
        : i,
    );
  }

  public async delete(id: string) {
    this.posts.filter((i) => i.id !== id);

    return true;
  }
}
