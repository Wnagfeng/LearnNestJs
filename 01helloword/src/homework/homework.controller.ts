import { Controller, Get, Query } from '@nestjs/common';
import { HomeworkService } from './homework.service';
interface IqueyType {
  num: number;
}
@Controller('range')
export class HomeworkController {
  constructor(private homeworkservice: HomeworkService) {}
  @Get()
  getNumber(@Query() query: IqueyType) {
    return this.homeworkservice.getArrayFornumver(query);
  }
}
