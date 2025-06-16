import { ThrottlerGuard } from '@nestjs/throttler';
import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiServiceUnavailableResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeepseekService } from './deepseek.service';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@UseGuards(ThrottlerGuard)
export class AiController {
  constructor(private readonly deepseekService: DeepseekService) {}

  @ApiOperation({
    summary: 'Check API availability',
  })
  @ApiOkResponse({
    description: 'API is available',
  })
  @ApiServiceUnavailableResponse({
    description: 'API is unavailable',
  })
  @Get('health-check')
  @HttpCode(HttpStatus.OK)
  public async checkHealth() {
    try {
      await this.deepseekService.generateText('test');
      return { status: 'ok', message: 'API is available' };
    } catch (error) {
      throw new Error('API is unavailable');
    }
  }
}
