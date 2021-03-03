import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfKnowledgeBlockService } from './type-of-knowledge-block.service';

describe('TypeOfKnowledgeBlockService', () => {
  let service: TypeOfKnowledgeBlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeOfKnowledgeBlockService]
    }).compile();

    service = module.get<TypeOfKnowledgeBlockService>(TypeOfKnowledgeBlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
