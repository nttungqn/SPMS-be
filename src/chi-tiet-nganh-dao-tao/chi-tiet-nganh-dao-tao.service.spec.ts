import { Test, TestingModule } from '@nestjs/testing';
import { ChiTietNganhDaoTaoService } from './chi-tiet-nganh-dao-tao.service';

describe('ChiTietNganhDaoTaoService', () => {
  let service: ChiTietNganhDaoTaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChiTietNganhDaoTaoService],
    }).compile();

    service = module.get<ChiTietNganhDaoTaoService>(ChiTietNganhDaoTaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
