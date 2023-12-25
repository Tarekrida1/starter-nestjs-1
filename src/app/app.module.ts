import { LoggerMiddleware } from './middlewares/logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from './shared/shared.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import path = require('path');
import { ConfigModule } from '@nestjs/config';
import { ErrorHandlerInterceptor } from './shared/interceptors/error-handler.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServicesModule } from './modules/services/services.module';
import { CoursesModule } from './modules/courses/courses.module';
import { FormModule } from './modules/form/form.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.mongoUrl),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          dirname: path.join(__dirname, '..', '..', 'log/debug/'),
          filename: 'debug.log',
          level: 'debug',
        }),
        new winston.transports.File({
          dirname: path.join(__dirname, '..', '..', 'log/info/'),
          filename: 'info.log',
          level: 'info',
        }),
      ],
    }),
    SharedModule,
    ServicesModule,
    CoursesModule,
    FormModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorHandlerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
