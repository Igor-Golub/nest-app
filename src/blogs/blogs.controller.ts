import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  getAll() {}

  @Get()
  getById(@Param('id') id: string) {}

  @Get()
  getPosts(@Param('id') blogId: string) {}

  @Post()
  create(@Body() createBlogDto: ApiDTO.BlogCreateAndUpdate) {}

  @Post()
  createPost(
    @Param('id') blogId: string,
    @Body() createCommentDto: ApiDTO.PostCreateAndUpdate,
  ) {}

  @Put()
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: ApiDTO.BlogCreateAndUpdate,
  ) {}

  @Delete()
  delete(@Param('id') id: string) {}
}
