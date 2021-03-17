import { Test, TestingModule } from '@nestjs/testing';
import { ChuanDauRaMonHocService } from './chuan-dau-ra-mon-hoc.service';

describe('ChuanDauRaMonHocService', () => {
  let service: ChuanDauRaMonHocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChuanDauRaMonHocService]
    }).compile();

    service = module.get<ChuanDauRaMonHocService>(ChuanDauRaMonHocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
