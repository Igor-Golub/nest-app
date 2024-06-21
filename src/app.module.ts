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
import { BlogsService } from './features/blogs/application/blogs.service';
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
import { JwtModule, JwtService } from '@nestjs/jwt';
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
import * as process from 'node:process';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: '',
      signOptions: {
        expiresIn: '60s',
      },
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
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL!.toString()),
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
    JwtService,
    PostsService,
    PostsRepo,
    PostsQueryRepo,
    PaginationService,
    ClientSortingService,
    ClientFilterService,
    CryptoService,
    BlogsService,
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
    RecoveryRepo,
    EmailService,
    NotifyManager,
    SmtpService,
    EmailTemplatesCreatorService,
  ],
})
export class AppModule {}
