import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';

interface SendParams {
  login: string;
  email: string;
  data: string;
}

@Injectable()
export class NotifyManager {
  constructor(private readonly emailService: EmailService) {}
  public async sendRegistrationEmail(parameters: SendParams) {
    return this.emailService.sendRegistration(parameters);
  }

  public async sendRecoveryEmail(parameters: SendParams) {
    return this.emailService.sendRecovery(parameters);
  }
}
