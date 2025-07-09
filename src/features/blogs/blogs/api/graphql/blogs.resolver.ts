import { Repository } from 'typeorm';
import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../../domain/blog.entity';
import { BlogViewModel } from '../models/output';
import { BlogsViewMapperManager } from '../mappers';
import { BlogsQueryDtoParams } from '../models/input';
import { Post } from '../../../posts/domain/post.entity';
import { PostViewModel } from '../../../posts/api/models/output';

@Resolver(() => BlogViewModel)
export class BlogsResolver {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  @Query(() => BlogViewModel, { nullable: true })
  public async blog(@Args() { blogId }: BlogsQueryDtoParams) {
    const blog = await this.blogRepository.findOneBy({ id: blogId });

    if (!blog) return null;

    return BlogsViewMapperManager.mapBlogsToViewModel(blog);
  }

  @ResolveField(() => [PostViewModel], { name: 'posts' })
  public async getBlogPosts(@Parent() blog: BlogViewModel) {
    const posts = await this.postRepository.find({
      where: { blogId: blog.id },
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
    }));
  }
}
