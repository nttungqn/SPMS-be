import { Test, TestingModule } from '@nestjs/testing';
import { GomNhomService } from './gom-nhom.service';

describe('GomNhomService', () => {
  let service: GomNhomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GomNhomService]
    }).compile();

    service = module.get<GomNhomService>(GomNhomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
