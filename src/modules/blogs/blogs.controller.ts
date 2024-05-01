import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/createBlogDto';
import { UpdateBlogDto } from './dto/updateBlogDto';
import { CreateCommentDto } from '../comments/dto/createCommentDto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  public async getAll(@Query() query: Api.BlogQuery) {}

  @Post()
  public async create(@Body() createBlogDto: CreateBlogDto) {
    this.blogsService.create(createBlogDto);
  }

  @Get(':id')
  public async getById(@Param('id') id: string) {
    return this.blogsService.findById(id);
  }

  @Get(':id')
  public async getPosts(@Param('id') blogId: string) {}

  @Post(':id')
  public async createPost(
    @Param('id') blogId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {}

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    return this.blogsService.delete(id);
  }
}
