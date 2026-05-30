import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable, tap } from 'rxjs';
import { Logger } from 'winston';

import { LOGGER } from './logger.provider';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOGGER)
    private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();

          this.logger.info('HTTP Request', {
            method: request.method,
            url: request.originalUrl,
            statusCode: response.statusCode,
            duration: `${Date.now() - startTime}ms`,
            ip: request.ip,
          });
        },

        error: (error) => {
          const response = context.switchToHttp().getResponse();

          this.logger.error('HTTP Error', {
            method: request.method,
            url: request.originalUrl,
            statusCode: response?.statusCode,
            duration: `${Date.now() - startTime}ms`,
            error: error.message,
            stack: error.stack,
          });
        },
      }),
    );
  }
}
