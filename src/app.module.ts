import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { CqrsModule } from '@nestjs/cqrs';
import { PaginationService } from './infrastructure/services/pagination.service';
import { ClientSortingService } from './infrastructure/services/clientSorting.service';
import { ClientFilterService } from './infrastructure/services/filter.service';
import { CryptoService } from './infrastructure/services/crypto.service';
import { PostModel, PostSchema } from './features/posts/domain/postModel';
import { PostsController } from './features/posts/api/posts.controller';
import { PostsRepo } from './features/posts/infrastructure/posts.repo';
import { PostsQueryRepo } from './features/posts/infrastructure/posts.query.repo';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsRepo } from './features/blogs/infrastructure/blogs.repo';
import { BlogsQueryRepo } from './features/blogs/infrastructure/blogs.query.repo';
import { BlogModel, BlogSchema } from './features/blogs/domain/blogEntity';
import { UsersRepo } from './features/users/infrastructure/users.repo';
import { UsersQueryRepo } from './features/users/infrastructure/users.query.repo';
import { UserModel, UserSchema } from './features/users/domain/userEntity';
import { TestingController } from './features/testing/api/testing.controller';
import { UsersController } from './features/users/api/users.controller';
import { AuthController } from './features/auth/api/auth.controller';
import { CommentsController } from './features/comments/api/comments.controller';
import { PostsCommentsRepo } from './features/comments/infrastructure/comments.repo';
import { CommentsQueryRepo } from './features/comments/infrastructure/comments.query.repo';
import { AuthService } from './features/auth/application/auth.service';
import { LocalStrategy } from './features/auth/strategies/local.strategy';
import { JwtStrategy } from './features/auth/strategies/jwt.strategy';
import {
  PostsCommentsModel,
  PostsCommentsSchema,
} from './features/comments/domain/postsCommentsModel';
import { RecoveryRepo } from './features/auth/infrastructure/recovery.repo';
import { EmailService } from './infrastructure/managers/email.service';
import { SmtpService } from './infrastructure/managers/smtp.service';
import { EmailTemplatesCreatorService } from './infrastructure/managers/emailTemplatesCreator.service';
import { NotifyManager } from './infrastructure/managers/notify.manager';
import {
  RecoveryModel,
  RecoverySchema,
} from './features/auth/domain/recoveryEntity';
import { jwtConstants } from './constants';
import { BasicStrategy } from './features/auth/strategies/basic.strategy';
import {
  EmailIsExistConstraint,
  LoginIsExistConstraint,
} from './common/decorators';
import configuration from './settings/configuration';
import { CreateBlogHandler } from './features/blogs/application/createBlog.useCase';
import { DeleteBlogHandler } from './features/blogs/application/deleteBlog.useCase';
import { UpdateBlogHandler } from './features/blogs/application/updateBlog.useCase';
import { CreatePostForBlogHandler } from './features/blogs/application/createPostForBlog.useCase';
import { RegisterHandler } from './features/auth/application/register.useCase';
import { LoginHandler } from './features/auth/application/login.useCase';
import { ResendConfirmationHandler } from './features/auth/application/resendConfirmation.useCase';
import { ConfirmRegistrationHandler } from './features/auth/application/confirmRegistration.useCase';
import { PasswordRecoveryHandler } from './features/auth/application/passwordRecovery.useCase';
import { ConfirmPasswordRecoveryHandler } from './features/auth/application/confirmPasswordRecovery.useCase';
import {
  CreatePostCommentHandler,
  CreatePostHandler,
  DeletePostHandler,
  UpdatePostHandler,
  UpdatePostLikeStatusHandler,
} from './features/posts/application';
import { UpdateCommentLikeHandler } from './features/comments/application/update.useCase';
import { UpdateCommentLikeStatusHandler } from './features/comments/application/updateStatus.useCase';
import { DeleteCommentHandler } from './features/comments/application/delete.useCase';
import { CreateUserHandler } from './features/users/application/create.useCase';
import {
  PostLikesModel,
  PostLikesSchema,
} from './features/posts/domain/postLikesModel';
import { PostsLikesRepo } from './features/posts/infrastructure/postsLikes.repo';
import { PostsCommentsLikesRepo } from './features/comments/infrastructure/postCommentsLikes.repo';
import {
  PostCommentLikeModel,
  PostCommentLikeSchema,
} from './features/comments/domain/postsCommentsLikesModel';
import { PostsCommentsLikesQueryRepo } from './features/comments/infrastructure/postCommentsLikes.query.repo';

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
  PostsRepo,
  PostsQueryRepo,
  PostsLikesRepo,
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

const usersHandlers = [CreateUserHandler];

const usersProviders = [UsersRepo, UsersQueryRepo, ...usersHandlers];

const authHandlers = [
  LoginHandler,
  RegisterHandler,
  PasswordRecoveryHandler,
  ResendConfirmationHandler,
  ConfirmRegistrationHandler,
  ConfirmPasswordRecoveryHandler,
];

const authProviders = [AuthService, ...authHandlers];

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
    MongooseModule.forRoot(process.env.MONGO_URL!.toString()),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME!.toString() },
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
        name: UserModel.name,
        schema: UserSchema,
      },
      {
        name: PostsCommentsModel.name,
        schema: PostsCommentsSchema,
      },
      {
        name: RecoveryModel.name,
        schema: RecoverySchema,
      },
      {
        name: PostCommentLikeModel.name,
        schema: PostCommentLikeSchema,
      },
    ]),
  ],
  controllers: [
    PostsController,
    BlogsController,
    UsersController,
    AuthController,
    TestingController,
    CommentsController,
  ],
  providers: [
    ...postsProviders,
    ...blogsProviders,
    ...usersProviders,
    ...commentsProviders,
    ...authProviders,
    PaginationService,
    ClientSortingService,
    ClientFilterService,
    CryptoService,
    LocalStrategy,
    JwtStrategy,
    BasicStrategy,
    RecoveryRepo,
    EmailService,
    NotifyManager,
    SmtpService,
    EmailTemplatesCreatorService,
    LoginIsExistConstraint,
    EmailIsExistConstraint,
  ],
})
export class AppModule {}
