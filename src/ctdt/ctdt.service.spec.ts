import { Test, TestingModule } from '@nestjs/testing';
import { CtdtService } from './ctdt.service';

describe('CtdtService', () => {
  let service: CtdtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CtdtService]
    }).compile();

    service = module.get<CtdtService>(CtdtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
