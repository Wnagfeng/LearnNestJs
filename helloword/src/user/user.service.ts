import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUsers() {
    return {
      code: 0,
      data: [],
      message: '请求数据成功1',
    };
  }
  addUsers() {
    return {
      code: 0,
      data: [],
      message: '添加用户成功',
    };
  }
}
