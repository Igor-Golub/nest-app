import { Repository } from 'typeorm';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/blog.entity';
import { BlogViewModel } from '../models/output';
import { BlogsViewMapperManager } from '../mappers';
import { BlogsQueryDtoParams } from '../models/input';

@Resolver()
export class BlogsResolver {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  @Query(() => BlogViewModel, { nullable: true })
  public async blog(@Args() { blogId }: BlogsQueryDtoParams) {
    const blog = await this.blogRepository.findOneBy({ id: blogId });

    if (!blog) return null;

    return BlogsViewMapperManager.mapBlogsToViewModel(blog);
  }
}
