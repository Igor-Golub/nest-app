import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationService } from './application/services/pagination.service';
import { ClientSortingService } from './application/services/clientSorting.service';
import { ClientFilterService } from './application/services/filter.service';
import { CommentsRepo } from './modules/comments/comments.repo';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CryptoService } from './application/services/crypto/crypto.service';
import { BlogsModule } from './modules/blogs/blogs.module';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL!.toString()),
    AuthModule,
    UsersModule,
    BlogsModule,
    PostsModule,
    CommentsRepo,
  ],
  providers: [
    PaginationService,
    ClientSortingService,
    ClientFilterService,
    CryptoService,
  ],
})
export class AppModule {}
