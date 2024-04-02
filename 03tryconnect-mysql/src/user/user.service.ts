import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entitys/user.entitys';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // 获取用户列表
  async getuserlist(): Promise<User[]> {
    // 获取到所有用户数据
    const users = await this.userRepository.find();
    return users;
  }
  // 创建用户
  async createuser(user: User): Promise<User> {
    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser; // 返回新增的用户信息
  }
  // 更新用户
  async updateuser(id: number, user: User): Promise<any> {
    // 解析请求携带的params参数
    // 修改之前做一下异常处理

    if (id === undefined) {
      throw new Error('id不能为空'); // 抛出异常
    } else if (user === undefined) {
      throw new Error('user不能为空');
    }
    const res = await this.userRepository.update(id, user);
    return res;
  }
  // 删除用户
  async deleteuser(id: number): Promise<any> {
    console.log(id);
    // // 解析请求携带的params参数
    const res = await this.userRepository.delete(id);

    return res;
  }
  // 根据id获取用户信息
  async getuserdetail(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true, // 加载用户的profile信息
        logs: true, // 加载用户的日志信息
        roles: true, // 加载用户的角色信息
      },
    });
    return user;
  }
}
