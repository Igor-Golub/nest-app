export declare global {
  namespace ServicesModels {
    interface CreateUserInput {
      login: string;
      email: string;
      password: string;
    }

    interface RegisterUserInput {
      login: string;
      email: string;
      password: string;
    }

    interface LoginUserInput {
      loginOrEmail: string;
      password: string;
    }
  }
}
