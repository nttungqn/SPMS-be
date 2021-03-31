import { Test, TestingModule } from '@nestjs/testing';
import { MonHocTruocService } from './mon-hoc-truoc.service';

describe('MonHocTruocService', () => {
  let service: MonHocTruocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonHocTruocService]
    }).compile();

    service = module.get<MonHocTruocService>(MonHocTruocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
