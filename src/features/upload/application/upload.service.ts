import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadedFile } from '../domain/file.entity';
import { Repository } from 'typeorm';
import { RepositoryError } from '../../../core/errors';

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
}
