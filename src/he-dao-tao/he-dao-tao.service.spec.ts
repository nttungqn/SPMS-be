import { Test, TestingModule } from '@nestjs/testing';
import { HeDaotaoService } from './he-dao-tao.service';

describe('HeDaotaoService', () => {
  let service: HeDaotaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeDaotaoService]
    }).compile();

    service = module.get<HeDaotaoService>(HeDaotaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
