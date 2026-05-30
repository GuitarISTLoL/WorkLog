import { type MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvFilePaths } from './config/env.config';
import { getTypeOrmConfig } from './config/typeorm.config';
import { LogModule } from './log/log.module';
import { WorkTypeModule } from './work-type/work-type.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    LoggerModule,
    LogModule,
    WorkTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
