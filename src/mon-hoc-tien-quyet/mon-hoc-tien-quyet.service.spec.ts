import { Test, TestingModule } from '@nestjs/testing';
import { MonHocTienQuyetService } from './mon-hoc-tien-quyet.service';

describe('MonHocTienQuyetService', () => {
  let service: MonHocTienQuyetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonHocTienQuyetService]
    }).compile();

    service = module.get<MonHocTienQuyetService>(MonHocTienQuyetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
