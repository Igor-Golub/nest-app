export declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string | null;
        deviceId: string | null;
      };
    }
  }
}
