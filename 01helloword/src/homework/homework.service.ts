import { Injectable } from '@nestjs/common';
interface IqueyType {
  num: number;
}
@Injectable()
export class HomeworkService {
  getArrayFornumver(query: IqueyType) {
    const queryNumber = query.num;
    const result = [];
    for (let i = 0; i < queryNumber; i++) {
      result.push(i.toString());
    }
    return {
      text: '获取数据成功',
      message: `您携带的查询参数为${queryNumber}`,
      data: result,
    };
  }
}
