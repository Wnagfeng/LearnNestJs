import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseConfig } from '../types/interface';
import { ConfigService } from '@nestjs/config';
import * as config from 'config';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    const dbUser = this.configService.get<string>('DATABASE_USER');
    // console.log('官方库的获取', dbUser); // 这里来测试
    console.log('ENV配置', dbUser); // 这里来测试
    // console.log('yml获取配置', this.configService.get<DatabaseConfig>('db'));
    const server = config.get('server');
    console.log('获取json配置', server);
    return this.appService.getHello();
  }
}
