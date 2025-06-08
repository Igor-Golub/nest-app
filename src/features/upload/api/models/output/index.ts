import { ApiProperty } from '@nestjs/swagger';

export class UploadedFileViewModel {
  @ApiProperty({
    example: 'f1a2b3c4-5678-90ab-cdef-1234567890ab',
    description: 'File id',
  })
  id: string;
}

export class FileMetaViewModel {
  @ApiProperty({
    example: 'f1a2b3c4-5678-90ab-cdef-1234567890ab',
    description: 'File id',
  })
  id: string;

  @ApiProperty({
    example: 'report.pdf',
    description: 'Original file name',
  })
  name: string;

  @ApiProperty({
    example: 1048576,
    description: 'File size',
  })
  size: number;

  @ApiProperty({
    example: 'application/pdf',
    description: 'MIME-type of file',
  })
  mimetype: string;
}
