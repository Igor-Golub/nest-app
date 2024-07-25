import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { CqrsModule } from '@nestjs/cqrs';
import { PaginationService } from './infrastructure/services/pagination.service';
import { ClientSortingService } from './infrastructure/services/clientSorting.service';
import { ClientFilterService } from './infrastructure/services/filter.service';
import { CryptoService } from './infrastructure/services/crypto.service';
import { PostModel, PostSchema } from './features/posts/domain/postModel';
import { PostsController } from './features/posts/api/posts.controller';
import {
  PostsRepo,
  PostsQueryRepo,
  PostsLikesRepo,
  PostsLikesQueryRepo,
} from './features/posts/infrastructure';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsRepo, BlogsQueryRepo } from './features/blogs/infrastructure';
import { BlogModel, BlogSchema } from './features/blogs/domain/blogEntity';
import { CommentsController } from './features/comments/api/comments.controller';
import {
  PostsCommentsRepo,
  CommentsQueryRepo,
  PostsCommentsLikesRepo,
  PostsCommentsLikesQueryRepo,
} from './features/comments/infrastructure';
import {
  LocalStrategy,
  JwtStrategy,
  BasicStrategy,
} from './features/auth/strategies';
import {
  PostsCommentsModel,
  PostsCommentsSchema,
} from './features/comments/domain/postsCommentsModel';
import {
  EmailIsExistConstraint,
  LoginIsExistConstraint,
  BlogIsExistConstraint,
} from './common/decorators';
import configuration from './settings/configuration';
import {
  CreateBlogHandler,
  DeleteBlogHandler,
  UpdateBlogHandler,
  CreatePostForBlogHandler,
} from './features/blogs/application';
import {
  CreatePostCommentHandler,
  CreatePostHandler,
  DeletePostHandler,
  UpdatePostHandler,
  UpdatePostLikeStatusHandler,
} from './features/posts/application';
import {
  DeleteCommentHandler,
  UpdateCommentLikeHandler,
  UpdateCommentLikeStatusHandler,
} from './features/comments/application';
import {
  PostLikesModel,
  PostLikesSchema,
} from './features/posts/domain/postLikesModel';
import {
  PostCommentLikeModel,
  PostCommentLikeSchema,
} from './features/comments/domain/postsCommentsLikesModel';
import { AccessTokenExistMiddleware } from './common/middleware/isAccessTokenExist';
import { PostsService } from './features/posts/application/posts.service';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { UserModel, UserSchema } from './features/users/domain/userEntity';
import {
  RecoveryModel,
  RecoverySchema,
} from './features/auth/domain/recoveryEntity';
import { JwtService } from '@nestjs/jwt';
import { TestingModule } from './features/testing/testing.module';

const blogsHandlers = [
  CreateBlogHandler,
  UpdateBlogHandler,
  DeleteBlogHandler,
  CreatePostForBlogHandler,
];

const blogsProviders = [BlogsRepo, BlogsQueryRepo, ...blogsHandlers];

const postsHandlers = [
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
  UpdatePostLikeStatusHandler,
  CreatePostCommentHandler,
];

const postsProviders = [
  PostsService,
  PostsRepo,
  PostsQueryRepo,
  PostsLikesRepo,
  PostsLikesQueryRepo,
  ...postsHandlers,
];

const commentsHandlers = [
  UpdateCommentLikeHandler,
  UpdateCommentLikeStatusHandler,
  DeleteCommentHandler,
  PostsCommentsLikesRepo,
];

const commentsProviders = [
  PostsCommentsRepo,
  PostsCommentsLikesQueryRepo,
  CommentsQueryRepo,
  ...commentsHandlers,
];

@Module({
  imports: [
    CqrsModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('throttle.ttl')!,
          limit: config.get('throttle.limit')!,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PassportModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get('db.mongoUri')!,
      }),
    }),
    MongooseModule.forFeature([
      {
        name: PostModel.name,
        schema: PostSchema,
      },
      {
        name: PostLikesModel.name,
        schema: PostLikesSchema,
      },
      {
        name: BlogModel.name,
        schema: BlogSchema,
      },
      {
        name: PostsCommentsModel.name,
        schema: PostsCommentsSchema,
      },
      {
        name: PostCommentLikeModel.name,
        schema: PostCommentLikeSchema,
      },
    ]),
    UsersModule,
    AuthModule,
    TestingModule,
  ],
  controllers: [PostsController, BlogsController, CommentsController],
  providers: [
    ...postsProviders,
    ...blogsProviders,
    ...commentsProviders,
    JwtService,
    PaginationService,
    ClientSortingService,
    ClientFilterService,
    CryptoService,
    LocalStrategy,
    JwtStrategy,
    BasicStrategy,
    LoginIsExistConstraint,
    EmailIsExistConstraint,
    BlogIsExistConstraint,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessTokenExistMiddleware)
      .forRoutes('blogs', 'posts', 'comments');
  }
}
