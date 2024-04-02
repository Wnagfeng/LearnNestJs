import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { Env } from '../types/env.type';
import { User } from 'entitys/user.entitys';
import { logs } from 'entitys/logs.entitys';
import { profile } from 'entitys/profile.entity';
import { roles } from 'entitys/roles.entity';
import { UserModule } from './user/user.module';
import { LogModule } from './log/log.module';
const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envPath,
      // 这里新增.env的文件解析
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_PORT: Joi.number().default(3306),
        DB_URL: Joi.string().domain(),
        DB_HOST: Joi.string().ip(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get(Env.DB_TYPE),
          host: configService.get(Env.DB_HOST),
          port: configService.get(Env.DB_PORT),
          username: configService.get(Env.DB_USERNAME),
          password: configService.get(Env.DB_PASSWORD),
          database: configService.get(Env.DB_NAME),
          entities: [User, logs, profile, roles],
          synchronize: true,
          logging: true, //打印日志
        } as TypeOrmModuleOptions),
    }),
    UserModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
