import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}
  @Get()
  getUsers(): any {
    console.log('获取配置', this.configService.get('db'));
    return this.userService.getUsers();
  }
  @Post()
  addUsers(): any {
    return this.userService.addUsers();
  }
}
