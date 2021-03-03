import { Test, TestingModule } from '@nestjs/testing';
import { NamHocService } from './nam-hoc.service';

describe('NamHocService', () => {
  let service: NamHocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NamHocService]
    }).compile();

    service = module.get<NamHocService>(NamHocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
