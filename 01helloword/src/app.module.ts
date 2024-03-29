import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { HomeworkModule } from './homework/homework.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'configuration'; //define the configuration file path
@Module({
  // 导入配置模块
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration], //加载配置文件
    }),
    UserModule,
    HomeworkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
