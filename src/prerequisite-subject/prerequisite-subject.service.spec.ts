import { Test, TestingModule } from '@nestjs/testing';
import { PrerequisiteSubjectService } from './prerequisite-subject.service';

describe('PrerequisiteSubjectService', () => {
  let service: PrerequisiteSubjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrerequisiteSubjectService]
    }).compile();

    service = module.get<PrerequisiteSubjectService>(PrerequisiteSubjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
