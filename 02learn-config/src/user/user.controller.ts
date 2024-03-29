import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}
  @Get()
  getystemUsers() {
    // const dbUser = this.configService.get<string>('DATABASE_USER');
    // console.log(dbUser); // 这里来测试
    return this.userService.getUsers();
  }
}
