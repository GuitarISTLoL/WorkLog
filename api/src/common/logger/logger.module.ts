import { Global, Module } from '@nestjs/common';

import { LoggerProvider } from './logger.provider';
import { LoggingInterceptor } from './logging.interceptor';

@Global()
@Module({
  providers: [LoggerProvider, LoggingInterceptor],
  exports: [LoggerProvider, LoggingInterceptor],
})
export class LoggerModule {}
