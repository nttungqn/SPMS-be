import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { GENERATE_SYLLABUS_MESSAGE, SYLLABUS_MESSAGE } from 'constant/constant';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { RolesGuard } from 'guards/roles.guard';
import { SyllabusDto } from './dto/syllabus.dto';
import { GenerateSyllabusService } from './generate-syllabus.service';

@ApiTags('generate-syllabus')
@Controller('generate-syllabus')
export class GenerateSyllabusController {
  constructor(private readonly generateSyllabusService: GenerateSyllabusService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([Role.GIAOVIEN, Role.ADMIN])
  @ApiBearerAuth('token')
  @ApiUnauthorizedResponse({ description: GENERATE_SYLLABUS_MESSAGE.GENERATE_SYLLABUS_NOT_AUTHORIZED })
  @ApiInternalServerErrorResponse({ description: GENERATE_SYLLABUS_MESSAGE.GENERATE_SYLLABUS_FAILED })
  @ApiOkResponse({ description: SYLLABUS_MESSAGE.UPDATE_SYLLABUS_SUCCESSFULLY })
  @Put(':id')
  async put(@Req() req, @Param('id') id: number, @Body() newData: SyllabusDto): Promise<any> {
    const user = req.user || {};
    await this.generateSyllabusService.put(newData, id, user);
    return new HttpException(GENERATE_SYLLABUS_MESSAGE.GENERATE_SYLLABUS_SUCCESSFULLY, HttpStatus.OK);
  }
}
