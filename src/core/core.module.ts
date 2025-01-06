import { Global, Module } from '@nestjs/common';
import { CoreConfig } from './core.config';
import { CoreEnvUtils } from './core.env.utils';

@Global()
@Module({
  providers: [CoreConfig, CoreEnvUtils],
  exports: [CoreConfig, CoreEnvUtils],
})
export class CoreModule {}
