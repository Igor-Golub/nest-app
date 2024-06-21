import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';

interface NotifyOptions {
  from: string;
  address: string;
  subject: string;
  template: string;
}

@Injectable()
export class SmtpService {
  private transport;

  constructor() {
    this.transport = this.createTransport();
  }

  private createTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
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
