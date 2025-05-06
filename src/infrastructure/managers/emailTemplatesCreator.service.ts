import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailTemplatesCreatorService {
  constructor(private readonly configService: ConfigService) {}

  private wrapWithLayout(title: string, content: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f6f8;
          padding: 40px;
          color: #333;
        }

        .container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        h1 {
          color: #2e86de;
        }

        a.button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 20px;
          background-color: #2e86de;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }

        p {
          line-height: 1.6;
        }

        .footer {
          margin-top: 40px;
          font-size: 0.9em;
          color: #888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${content}
        <div class="footer">
          &copy; ${new Date().getFullYear()} SomeSite. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `;
  }

  public getRegistrationTemplate(login: string, code: string): string {
    const content = `
      <h1>Thank you, ${login}, for registering!</h1>
      <p>We're excited to have you on board.</p>
      <p>To complete your registration, please confirm your email by clicking the button below:</p>
      <a href="https://somesite.com/confirm-email?code=${code}" class="button">Complete Registration</a>
      <p>If you did not sign up for this account, you can safely ignore this email.</p>
    `;

    return this.wrapWithLayout('Registration Confirmation', content);
  }

  public getRegistrationEmailResendingTemplate(
    login: string,
    code: string,
  ): string {
    const content = `
      <h1>Hello again, ${login}!</h1>
      <p>It looks like you haven't completed your registration yet.</p>
      <p>Click the button below to confirm your email and activate your account:</p>
      <a href="https://some-front.com/confirm-registration?code=${code}" class="button">Confirm My Account</a>
      <p>If you've already confirmed your account, you can ignore this message.</p>
    `;

    return this.wrapWithLayout('Complete Your Registration', content);
  }

  public getRecoveryTemplate(login: string, code: string): string {
    const content = `
      <h1>Password Recovery for ${login}</h1>
      <p>We received a request to reset your password.</p>
      <p>Click the button below to proceed with password recovery:</p>
      <a href="https://somesite.com/password-recovery?recoveryCode=${code}" class="button">Recover Password</a>
      <p>If you didn’t request a password reset, just ignore this email.</p>
    `;

    return this.wrapWithLayout('Password Recovery', content);
  }
}
