export declare global {
  namespace Express {
    export interface Request {
      context?: {
        userId: string | null;
      };
    }
  }
}
