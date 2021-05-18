import { Controller, Get, Query } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { FilterPermision } from './dto/filter-permission.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // @Post()
  // create(@Body() createPermissionDto: CreatePermissionDto) {
  //   return this.permissionService.create(createPermissionDto);
  // }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách các quyển' })
  findAll(@Query() filter: FilterPermision) {
    return this.permissionService.findAll(filter);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.permissionService.findOne(+id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
  //   return this.permissionService.update(+id, updatePermissionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.permissionService.remove(+id);
  // }
}
