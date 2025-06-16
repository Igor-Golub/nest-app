import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CoreEnvUtils } from '../../../core/core.env.utils';

@Injectable()
export class AiConfig {
  @IsNotEmpty({
    message: 'Set correct DEEPSEEK_API_KEY value',
  })
  public apiKey = this.configService.get('DEEPSEEK_API_KEY') as string;

  @IsString({
    message: 'Set correct DEEPSEEK_MODEL value, ex.: deepseek-chat',
  })
  public model = this.configService.get('DEEPSEEK_MODEL') as string;

  @IsNumber(
    {},
    {
      message: 'Set correct DEEPSEEK_TEMPERATURE value, ex.: 0.7',
    },
  )
  public temperature = Number(this.configService.get('DEEPSEEK_TEMPERATURE'));

  @IsNumber(
    {},
    {
      message: 'Set correct DEEPSEEK_MAX_TOKENS value, ex.: 1000',
    },
  )
  public maxTokens = Number(this.configService.get('DEEPSEEK_MAX_TOKENS'));

  @IsString({
    message: 'Set correct DEEPSEEK_API_URL value',
  })
  public apiUrl = this.configService.get('DEEPSEEK_API_URL') as string;

  constructor(private configService: ConfigService) {
    CoreEnvUtils.validateConfig(this);
  }
}
