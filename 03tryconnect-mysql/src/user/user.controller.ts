import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { query } from 'express';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getuserlist() {
    const users = await this.userService.getuserlist();
    return {
      message: 'User list',
      data: users,
      code: 200,
    };
  }
  @Delete()
  async deleteuser(@Query('id') id: number) {
    const user = await this.userService.deleteuser(id);
    return {
      message: 'User deleted',
      data: user,
      code: 200,
    };
  }
  @Patch()
  async updateuser(@Query('id') id: number, @Body() userdata: any) {
    console.log(userdata);
    console.log(id);
    const user = await this.userService.updateuser(id, userdata);
    return {
      message: 'User updated',
      code: 200,
    };
  }
  @Post()
  async createuser(@Body() userdata: any) {
    const user = await this.userService.createuser(userdata);
    return {
      message: 'User created',
      //   data: user,
      code: 200,
    };
  }
  // 根据用户id去获取用户详情 并且获取到用户的角色信息以及该用户的日志

  @Get('/:id')
  async getuserdetail(@Param('id') id: number) {
    console.log(id);
    // 自定义查询 不返回用户密码
    const user = await this.userService.getuserdetail(id);
    return {
      message: 'User detail',
      data: user,
      code: 200,
    };
  }
}
