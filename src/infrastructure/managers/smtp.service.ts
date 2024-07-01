import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface NotifyOptions {
  from: string;
  address: string;
  subject: string;
  template: string;
}

@Injectable()
export class SmtpService {
  private transport;

  constructor(private readonly configService: ConfigService) {
    this.transport = this.createTransport();
  }

  private createTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('smtp.email'),
        pass: this.configService.get<string>('smtp.password'),
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
