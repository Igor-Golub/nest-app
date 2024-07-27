import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  public getPostsIds(posts) {
    return posts.map(({ _id }) => _id.toString());
  }
}
