import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeBlockService } from './knowledge-block.service';

describe('KnowledgeBlockService', () => {
  let service: KnowledgeBlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnowledgeBlockService]
    }).compile();

    service = module.get<KnowledgeBlockService>(KnowledgeBlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
