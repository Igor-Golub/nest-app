import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { DeepseekService } from './deepseek.service';
import { AiConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, AiConfigModule],
  controllers: [AiController],
  providers: [DeepseekService],
  exports: [DeepseekService],
})
export class AiModule {}
