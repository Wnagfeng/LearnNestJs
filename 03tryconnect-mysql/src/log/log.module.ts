import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { logs } from '../../entitys/logs.entitys';
@Module({
  imports: [TypeOrmModule.forFeature([logs])],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
