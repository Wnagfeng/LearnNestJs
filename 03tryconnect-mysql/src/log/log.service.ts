import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { logs } from '../../entitys/logs.entitys';
@Injectable()
export class LogService {
  constructor(
    @InjectRepository(logs)
    private readonly logRepository: Repository<logs>,
  ) {}
  //   获取logs列表
  //   async getLogsList(): Promise<any> {
  //     return this.logRepository
  //       .createQueryBuilder('logs') //取个名字
  //       .select('logs.response') //你要查询的字段
  //       .addSelect('COUNT(logs.response)', 'count') //统计结果个数
  //       .leftJoinAndSelect('logs.user', 'user') //第一个参数是要连接的表名，第二个参数是要连接的表的字段名
  //       .where('userId=:id', { id: 2 }) //条件
  //       .groupBy('logs.response') //分组
  //       .getMany();
  //   }

  async getLogsList(): Promise<any> {
    return this.logRepository
      .createQueryBuilder('logs')
      .select('logs.response')
      .addSelect('COUNT(logs.response)', 'count')
      .leftJoinAndSelect('logs.user', 'user')
      .where('userId = :id', { id: 2 })
      .groupBy('logs.response')
      .getRawMany(); // 如果你使用原始查询而不是实体的话，使用getRawMany()
  }
}
