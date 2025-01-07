export declare global {
  namespace Base {
    interface HttpError {
      field: string;
      message: string;
    }

    interface ErrorResponse {
      errorsMessages: HttpError[];
    }

    interface Session {
      id: string;
      deviceId: string;
      refreshToken: string;
    }

    type DTOFromEntity<Entity> = Omit<
      Entity,
      'id' | 'owner' | 'createdAt' | 'updatedAt'
    >;
  }
}
