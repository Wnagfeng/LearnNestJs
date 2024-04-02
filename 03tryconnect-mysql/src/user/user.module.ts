import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entitys/user.entitys';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  // 依赖注入
  // 导入 TypeOrmModule 并将 User 实体传递给 forFeature 方法
  // 为什么需要注入 User 实体？
  // 因为 UserService 依赖 User 实体，UserService 才可以操作数据库
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
