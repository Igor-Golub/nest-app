import { Injectable, NestMiddleware } from '@nestjs/common';
import { UploadService } from '../../features/upload/application/upload.service';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  constructor(private readonly uploadService: UploadService) {}

  use(req: any, res: any, next: () => void) {
    req.uploadService = this.uploadService;
    next();
  }
}
