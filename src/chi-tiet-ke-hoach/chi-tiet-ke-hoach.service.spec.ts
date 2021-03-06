import { Test, TestingModule } from '@nestjs/testing';
import { ChiTietKeHoachService } from './chi-tiet-ke-hoach.service';

describe('ChiTietKeHoachService', () => {
  let service: ChiTietKeHoachService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChiTietKeHoachService]
    }).compile();

    service = module.get<ChiTietKeHoachService>(ChiTietKeHoachService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
