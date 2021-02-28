import { Test, TestingModule } from '@nestjs/testing';
import { ChuanDauRaNganhDaoTaoService } from './chuan-dau-ra-nganh-dao-tao.service';

describe('ChuanDauRaNganhDaoTaoService', () => {
  let service: ChuanDauRaNganhDaoTaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChuanDauRaNganhDaoTaoService]
    }).compile();

    service = module.get<ChuanDauRaNganhDaoTaoService>(ChuanDauRaNganhDaoTaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
