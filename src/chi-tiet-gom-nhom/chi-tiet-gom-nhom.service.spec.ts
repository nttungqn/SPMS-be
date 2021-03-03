import { Test, TestingModule } from '@nestjs/testing';
import { ChiTietGomNhomService } from './chi-tiet-gom-nhom.service';

describe('ChiTietGomNhomService', () => {
  let service: ChiTietGomNhomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChiTietGomNhomService]
    }).compile();

    service = module.get<ChiTietGomNhomService>(ChiTietGomNhomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
