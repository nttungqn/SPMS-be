import { Controller, Get } from '@nestjs/common';
import { generateTemplate } from 'utils/templateCTDT/templateCTDT';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('a')
  async getHelloa() {
    return await generateTemplate();
  }
}
