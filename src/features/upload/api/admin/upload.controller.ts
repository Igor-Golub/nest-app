import { extname } from 'path';
import { diskStorage } from 'multer';
import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BasicAuthGuard } from '../../../auth/guards';
import { UploadService } from '../../application/upload.service';

@UseGuards(BasicAuthGuard)
@Controller('sa/upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileMeta = await this.uploadService.saveFileMeta(file);

    return {
      fileId: fileMeta.id,
    };
  }
}
