import { Controller, Get } from '@nestjs/common';
import { LogService } from './log.service';
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}
  @Get()
  async getlos(): Promise<any> {
    return await this.logService.getLogsList();
  }
}
