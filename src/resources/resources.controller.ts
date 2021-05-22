import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'guards/roles.guard';
import { FilterPermission } from './dto/filter-permission.dto';
import { ResourcesService } from './resources.service';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth('token')
  @Get('/permission/:idRole')
  findAllPermission(@Param('idRole') idRole: number, @Query() filter: FilterPermission) {
    return this.resourcesService.findAllPermission(idRole, filter);
  }
}
