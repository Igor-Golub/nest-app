import { Module } from '@nestjs/common';
import { UploadController } from './api/admin/upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedFile } from './domain/file.entity';
import { UploadService } from './application/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([UploadedFile])],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [],
})
export class UploadModule {}
