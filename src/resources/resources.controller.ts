import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilterPermission } from './dto/filter-permission.dto';
import { ResourcesService } from './resources.service';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('/permission/:idRole')
  findAllPermission(@Param('idRole') idRole: number, @Query() filter: FilterPermission) {
    return this.resourcesService.findAllPermission(idRole, filter);
  }
}
