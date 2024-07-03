import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationService } from './infrastructure/services/pagination.service';
import { ClientSortingService } from './infrastructure/services/clientSorting.service';
import { ClientFilterService } from './infrastructure/services/filter.service';
import { ConfigModule } from '@nestjs/config';
import { CryptoService } from './infrastructure/services/crypto.service';
import { PostModel, PostSchema } from './features/posts/domain/postModel';
import { PostsController } from './features/posts/api/posts.controller';
import { PostsService } from './features/posts/application/posts.service';
import { PostsRepo } from './features/posts/infrastructure/posts.repo';
import { PostsQueryRepo } from './features/posts/infrastructure/posts.query.repo';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsRepo } from './features/blogs/infrastructure/blogs.repo';
import { BlogsQueryRepo } from './features/blogs/infrastructure/blogs.query.repo';
import { BlogModel, BlogSchema } from './features/blogs/domain/blogEntity';
import { UsersService } from './features/users/application/users.service';
import { UsersRepo } from './features/users/infrastructure/users.repo';
import { UsersQueryRepo } from './features/users/infrastructure/users.query.repo';
import { UserModel, UserSchema } from './features/users/domain/userEntity';
import { TestingController } from './features/testing/api/testing.controller';
import { UsersController } from './features/users/api/users.controller';
import { AuthController } from './features/auth/api/auth.controller';
import { CommentsController } from './features/comments/api/comments.controller';
import { CommentsService } from './features/comments/application/comments.service';
import { CommentsRepo } from './features/comments/infrastructure/comments.repo';
import { CommentsQueryRepo } from './features/comments/infrastructure/comments.query.repo';
import { AuthService } from './features/auth/application/auth.service';
import { LocalStrategy } from './features/auth/strategies/local.strategy';
import { JwtStrategy } from './features/auth/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {
  CommentsModel,
  CommentsSchema,
} from './features/comments/domain/commentsModel';
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
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogHandler } from './features/blogs/application/create.blog.useCase';
import { DeleteBlogHandler } from './features/blogs/application/delete.blog.useCase';
import { UpdateBlogHandler } from './features/blogs/application/update.blog.useCase';
import { CreatePostForBlogHandler } from './features/blogs/application/create.post.for.blog.useCase';
import { RegisterHandler } from './features/auth/application/register.useCase';
import { LoginHandler } from './features/auth/application/login.useCase';
import { ResendConfirmationHandler } from './features/auth/application/resendConfirmation.useCase';
import { ConfirmRegistrationHandler } from './features/auth/application/confirmRegistration.useCase';
import { PasswordRecoveryHandler } from './features/auth/application/passwordRecovery.useCase';
import { ConfirmPasswordRecoveryHandler } from './features/auth/application/confirmPasswordRecovery.useCase';

const blogsHandlers = [
  CreateBlogHandler,
  UpdateBlogHandler,
  DeleteBlogHandler,
  CreatePostForBlogHandler,
];

const authHandlers = [
  LoginHandler,
  RegisterHandler,
  PasswordRecoveryHandler,
  ResendConfirmationHandler,
  ConfirmRegistrationHandler,
  ConfirmPasswordRecoveryHandler,
];

@Module({
  imports: [
    CqrsModule,
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
        name: BlogModel.name,
        schema: BlogSchema,
      },
      {
        name: UserModel.name,
        schema: UserSchema,
      },
      {
        name: CommentsModel.name,
        schema: CommentsSchema,
      },
      {
        name: RecoveryModel.name,
        schema: RecoverySchema,
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
    PostsService,
    PostsRepo,
    PostsQueryRepo,
    PaginationService,
    ClientSortingService,
    ClientFilterService,
    CryptoService,
    BlogsRepo,
    BlogsQueryRepo,
    UsersService,
    UsersRepo,
    UsersQueryRepo,
    CommentsService,
    CommentsRepo,
    CommentsQueryRepo,
    AuthService,
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
    ...blogsHandlers,
    ...authHandlers,
  ],
})
export class AppModule {}
