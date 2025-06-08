import { Response } from 'express';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import {
  Get,
  Res,
  Post,
  Param,
  UseGuards,
  Controller,
  UploadedFile,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../../auth/guards';
import { UploadViewMapper } from '../mappers/viewMapper';
import { UploadService } from '../../application/upload.service';
import { FileMetaViewModel, UploadedFileViewModel } from '../models/output';

@ApiTags('Files')
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
    description: 'UUID of the uploaded file',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiExtraModels(FileMetaViewModel)
  @ApiOkResponse({
    type: FileMetaViewModel,
    description: 'Meta information about uploaded file',
  })
  @ApiNotFoundResponse({
    description: 'Information by resaved id not found',
  })
  @ApiBadRequestResponse({
    description: 'If id param not UUID',
  })
  @Get(':id/meta')
  async getFileMeta(@Param('id') id: string) {
    const fileMeta = await this.uploadService.findById(id);

    return UploadViewMapper.fileMetaToView(fileMeta);
  }

  @ApiOperation({
    summary: 'Download uploaded file by ID',
    description: 'Returns a file stream with appropriate headers for downloading.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    example: '9f8e1c7a-2d47-4c2d-a4e1-bb91c8123456',
    description: 'UUID of the uploaded file',
  })
  @ApiProduces('application/octet-stream')
  @ApiOkResponse({
    description: 'Returns the file as a stream',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'No file found with the given ID',
  })
  @ApiBadRequestResponse({
    description: 'Invalid file ID format',
  })
  @Get(':id')
  async downloadFile(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const fileMeta = await this.uploadService.findById(id);

    const fileStream = createReadStream(fileMeta.path);

    res.set({
      'Content-Type': fileMeta.mimetype,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(fileMeta.originalName)}"`,
    });

    return new StreamableFile(fileStream);
  }

  @ApiOperation({
    summary: 'Upload any file',
    description: 'Endpoint for uploading a file to the server. Accepts any file type.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    type: UploadedFileViewModel,
    description: 'Successfully uploaded file metadata',
  })
  @ApiBadRequestResponse({
    description: 'No file provided or file upload failed',
  })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: ({ uploadService }, file, callback) => {
          const filename = uploadService.generateUniqueFileName(file);
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
