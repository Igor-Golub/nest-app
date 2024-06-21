import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
  private readonly comments: { id: string }[] = [];

  public findById(id: string) {
    return this.comments.find((i) => i.id === id);
  }
}
