import { Test, TestingModule } from '@nestjs/testing';
import { ChuanDauRaService } from './chuan-dau-ra.service';

describe('ChuanDauRaService', () => {
  let service: ChuanDauRaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChuanDauRaService]
    }).compile();

    service = module.get<ChuanDauRaService>(ChuanDauRaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
