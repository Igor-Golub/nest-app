import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAll() {}

  @Get()
  getById(@Param('id') id: string) {}

  @Get()
  getComments(@Param('id') id: string) {}

  @Post()
  create(@Body() createPostDto: ApiDTO.PostCreateAndUpdate) {}

  @Put()
  update(
    @Param('id') id: string,
    @Body() updatePostDto: ApiDTO.PostCreateAndUpdate,
  ) {}

  @Delete()
  delete(@Param('id') id: string) {}
}
