import { Body, Controller, Post } from '@nestjs/common';
import { CreateMonHocTruocDto } from './dto/create-mon-hoc-truoc.dto';
import { MonHocTruocService } from './mon-hoc-truoc.service';

@Controller('mon-hoc-truoc')
export class MonHocTruocController {
  constructor(private readonly monHocTruocService: MonHocTruocService) {}
  @Post()
  create(@Body() newData: CreateMonHocTruocDto) {
    return this.monHocTruocService.create(newData);
  }
}
