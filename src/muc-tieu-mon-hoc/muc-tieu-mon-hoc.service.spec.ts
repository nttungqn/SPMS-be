import { Test, TestingModule } from '@nestjs/testing';
import { MucTieuMonHocService } from './muc-tieu-mon-hoc.service';

describe('MucTieuMonHocService', () => {
  let service: MucTieuMonHocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MucTieuMonHocService]
    }).compile();

    service = module.get<MucTieuMonHocService>(MucTieuMonHocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
