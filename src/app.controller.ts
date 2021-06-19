import { Controller, Get, Query } from '@nestjs/common';
import { generateTemplate } from 'utils/templateCTDT/templateCTDT';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('search')
  async search(@Query() query) {
    try {
      return await this.appService.search(query);
    } catch (error) {
      return [];
    }
  }

  @Get('show-all-keys')
  async getKeys() {
    return await this.appService.getKeys();
  }
}
