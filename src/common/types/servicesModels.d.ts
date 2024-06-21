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

    interface PasswordRecovery {
      email: string;
    }

    interface ConfirmPasswordRecovery {
      newPassword: string;
      recoveryCode: string;
    }

    interface ResendConfirmation {
      email: string;
    }
  }
}
