export declare global {
  namespace ServicesModels {
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
