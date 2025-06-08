import { FileMetaViewModel } from '../models/output';
import { UploadedFile } from '../../domain/file.entity';

export class UploadViewMapper {
  static fileMetaToView(meta: UploadedFile): FileMetaViewModel {
    return {
      id: meta.id,
      size: meta.size,
      mimetype: meta.mimetype,
      name: meta.originalName,
    };
  }
}
