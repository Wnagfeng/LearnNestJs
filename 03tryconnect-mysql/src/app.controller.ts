import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    const connectionString = this.configService.get<string>('BD_TYPE');
    console.log(__dirname);
    console.log(connectionString);
    return this.appService.getHello();
  }
}
