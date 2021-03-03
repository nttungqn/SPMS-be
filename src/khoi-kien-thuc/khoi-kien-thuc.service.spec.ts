import { Test, TestingModule } from '@nestjs/testing';
import { KhoiKienThucService } from './khoi-kien-thuc.service';

describe('KhoiKienThucService', () => {
  let service: KhoiKienThucService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KhoiKienThucService]
    }).compile();

    service = module.get<KhoiKienThucService>(KhoiKienThucService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
