import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeOfEducationDto } from './create-type-of-education.dto';

export class UpdateTypeOfEducationDto extends PartialType(CreateTypeOfEducationDto) {}
