import { PartialType } from '@nestjs/mapped-types';
import { CreateChuDeDTO } from './create-chu-de';

export class UpdateChuDeDTO extends PartialType(CreateChuDeDTO) {}
