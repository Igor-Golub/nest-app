import { Injectable } from '@nestjs/common';
import { SmtpService } from './smtp.service';
import { EmailTemplatesCreatorService } from './emailTemplatesCreator.service';

interface SendEmailParams {
  login: string;
  email: string;
  data: string;
}

@Injectable()
export class EmailService {
  constructor(
    private readonly smtpService: SmtpService,
    private readonly emailTemplatesCreatorService: EmailTemplatesCreatorService,
  ) {}

  public async sendRegistration(parameters: SendEmailParams) {
    return this.smtpService.send({
      from: '<MEGA service>',
      address: parameters.email,
      subject: 'Registration on MEGA service',
      template: this.emailTemplatesCreatorService.getRegistrationTemplate(
        parameters.login,
        parameters.data,
      ),
    });
  }

  public async sendRecovery(parameters: SendEmailParams) {
    return this.smtpService.send({
      from: '<MEGA service>',
      address: parameters.email,
      subject: 'Recovery password',
      template: this.emailTemplatesCreatorService.getRecoveryTemplate(
        parameters.login,
        parameters.data,
      ),
    });
  }

  public async sendNewConfirmationCode(parameters: SendEmailParams) {
    return this.smtpService.send({
      from: '<MEGA service>',
      address: parameters.email,
      subject: 'New confirmation code',
      template:
        this.emailTemplatesCreatorService.getNewConfirmationCoedTemplate(
          parameters.login,
          parameters.data,
        ),
    });
  }
}
