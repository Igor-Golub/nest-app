import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadedFile } from '../domain/file.entity';
import { Repository } from 'typeorm';
import { RepositoryError } from '../../../core/errors';
import { extname } from 'path';

@Injectable()
export class UploadService {
  constructor(@InjectRepository(UploadedFile) private fileRepository: Repository<UploadedFile>) {}

  public async findById(id: string) {
    const fileMeta = await this.fileRepository.findOneBy({ id });

    if (!fileMeta) throw new RepositoryError('File not found');

    return fileMeta;
  }

  public async saveFileMeta(file: Express.Multer.File) {
    const entity = this.fileRepository.create({
      originalName: file.originalname,
      storedName: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    });

    return this.fileRepository.save(entity);
  }

  public generateUniqueFileName(file: Express.Multer.File) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    return `${file.fieldname}-${uniqueSuffix}${ext}`;
  }
}
