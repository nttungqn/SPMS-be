import { Test, TestingModule } from '@nestjs/testing';
import { SoKhopService } from './so-khop.service';

describe('SoKhopService', () => {
  let service: SoKhopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SoKhopService]
    }).compile();

    service = module.get<SoKhopService>(SoKhopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
