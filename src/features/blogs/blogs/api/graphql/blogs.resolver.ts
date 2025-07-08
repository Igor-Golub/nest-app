import { Repository } from 'typeorm';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/blog.entity';
import { BlogArgs, BlogViewModel } from '../models/output';
import { BlogsViewMapperManager } from '../mappers';

@Resolver()
export class BlogsResolver {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  @Query(() => BlogViewModel, { nullable: true })
  public async blog(@Args() { id }: BlogArgs) {
    const blog = await this.blogRepository.findOneBy({ id });

    if (!blog) return null;

    return BlogsViewMapperManager.mapBlogsToViewModel(blog);
  }
}
