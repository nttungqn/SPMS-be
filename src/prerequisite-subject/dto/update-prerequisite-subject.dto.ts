import { PartialType } from '@nestjs/mapped-types';
import { CreatePrerequisiteSubjectDto } from './create-prerequisite-subject.dto';

export class UpdatePrerequisiteSubjectDto extends PartialType(CreatePrerequisiteSubjectDto) {}
