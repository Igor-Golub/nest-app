import type { UploadService } from '../features/upload/application/upload.service';

export declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string | null;
        deviceId: string | null;
      };

      uploadService: UploadService;
    }
  }
}
