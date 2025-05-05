import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { CoreConfig } from '../../core/core.config';

interface NotifyOptions {
  from: string;
  address: string;
  subject: string;
  template: string;
}

@Injectable()
export class SmtpService {
  private transport;

  constructor(private readonly coreConfig: CoreConfig) {
    this.transport = this.createTransport();
  }

  private createTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.coreConfig.smtpEmail,
        pass: this.coreConfig.smtpPassword,
      },
    });
  }

  public async send({ address, subject, from, template }: NotifyOptions) {
    return this.transport.sendMail({
      from,
      to: address,
      subject: subject,
      html: template,
    });
  }
}
