import { PartialType } from '@nestjs/mapped-types';
import { CreateChuDeDto } from './create-chu-de';

export class UpdateChuDeDTO extends PartialType(CreateChuDeDto) {}
