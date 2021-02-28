import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfEducationService } from './type-of-education.service';

describe('TypeOfEducationService', () => {
  let service: TypeOfEducationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeOfEducationService]
    }).compile();

    service = module.get<TypeOfEducationService>(TypeOfEducationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
