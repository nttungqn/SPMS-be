import { Test, TestingModule } from '@nestjs/testing';
import { PrerequisiteSubjectController } from './prerequisite-subject.controller';
import { PrerequisiteSubjectService } from './prerequisite-subject.service';

describe('PrerequisiteSubjectController', () => {
  let controller: PrerequisiteSubjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrerequisiteSubjectController],
      providers: [PrerequisiteSubjectService]
    }).compile();

    controller = module.get<PrerequisiteSubjectController>(PrerequisiteSubjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
