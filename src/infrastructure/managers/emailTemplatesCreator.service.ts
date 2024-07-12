import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailTemplatesCreatorService {
  constructor(private readonly configService: ConfigService) {}
  public getRegistrationTemplate(login: string, code: string) {
    return `
        <h1>Thank ${login} for your registration</h1>
        <p>
          To finish registration please follow the link below:
          <a href='${this.configService.get('front.host')}/confirmation?code=${code}'>complete registration</a>
        </p>
        `;
  }

  public getRecoveryTemplate(login: string, code: string) {
    return `
        <h1>Password recovery for, ${login}</h1>
          <p>To finish password recovery please follow the link below:
          <a href='${this.configService.get('front.host')}/recovery?recoveryCode=${code}'>recovery password</a>
        </p>
        `;
  }

  public getNewConfirmationCoedTemplate(login: string, code: string) {
    return `
        <h1>Hi, ${login}</h1>
          <p>Your new confirmation:
          <a href='${this.configService.get('front.host')}/confirm-registration?code=${code}'>code</a>
        </p>
        `;
  }
}
