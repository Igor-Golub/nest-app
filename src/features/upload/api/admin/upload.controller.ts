import { extname } from 'path';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  Get,
  Res,
  Post,
  Param,
  UseGuards,
  HttpStatus,
  Controller,
  UploadedFile,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../../auth/guards';
import { UploadViewMapper } from '../mappers/viewMapper';
import { UploadService } from '../../application/upload.service';

@UseGuards(BasicAuthGuard)
@Controller('sa/file')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @ApiOperation({
    summary: 'Get meta information about file',
    description: 'Response will include meta information about uploaded file.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    example: 'random UUID',
    description: 'Id of uploaded file',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieve meta information about uploaded file.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Information by resaved id not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'If id param not UUID',
  })
  @Get(':id/meta')
  async fileMeta(@Param('id') id: string) {
    const fileMeta = await this.uploadService.findById(id);

    return UploadViewMapper.fileMetaToView(fileMeta);
  }

  @Get(':id')
  async file(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const fileMeta = await this.uploadService.findById(id);

    const fileStream = createReadStream(fileMeta.path);

    res.set({
      'Content-Type': fileMeta.mimetype,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(fileMeta.originalName)}"`,
    });

    return new StreamableFile(fileStream);
  }

  @Post('upload')
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
