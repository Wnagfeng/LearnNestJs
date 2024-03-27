import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import configuration from 'configuration';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
console.log('EVN配置文件的读取', envPath);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: envPath,
      // 这里新增.env的文件解析
      load: [() => dotenv.config({ path: '.env' })],
      // 这里多了一个属性：validationSchema
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_USER: Joi.string().required(),
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
