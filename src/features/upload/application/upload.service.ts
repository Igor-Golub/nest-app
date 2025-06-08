import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadedFile } from '../domain/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UploadService {
  constructor(@InjectRepository(UploadedFile) private fileRepository: Repository<UploadedFile>) {}

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
}
