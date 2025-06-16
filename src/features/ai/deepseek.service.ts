import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { AiConfig } from './config/ai.config';
import { DomainError } from '../../core/errors';

interface DeepseekMessage {
  role: string;
  content: string;
}

interface DeepseekResponse {
  choices: Array<{
    message: DeepseekMessage;
  }>;
}

@Injectable()
export class DeepseekService {
  private httpCommonBody = {
    model: this.aiConfig.model,
    temperature: this.aiConfig.temperature,
    max_tokens: this.aiConfig.maxTokens,
  };

  private httpHeaders = {
    headers: {
      Authorization: `Bearer ${this.aiConfig.apiKey}`,
      'Content-Type': 'application/json',
    },
  };

  constructor(private readonly aiConfig: AiConfig) {}

  async generateText(prompt: string) {
    return this.sendPrompt(prompt);
  }

  private async sendPrompt(prompt: string) {
    if (!this.aiConfig.apiKey) {
      throw new DomainError('DeepSeek API key is not configured', HttpStatus.UNAUTHORIZED);
    }

    try {
      const response = await axios.post<DeepseekResponse>(
        this.aiConfig.apiUrl,
        { messages: [{ role: 'user', content: prompt }], ...this.httpCommonBody },
        this.httpHeaders,
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error('Failed to generate text with DeepSeek');
    }
  }
}
