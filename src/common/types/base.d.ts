export declare global {
  namespace Base {
    interface HttpError {
      field: string;
      message: string;
    }

    interface ErrorResponse {
      errorsMessages: HttpError[];
    }
  }
}
