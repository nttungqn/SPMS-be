import { Test, TestingModule } from '@nestjs/testing';
import { BloomService } from './bloom.service';

describe('BloomService', () => {
  let service: BloomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BloomService]
    }).compile();

    service = module.get<BloomService>(BloomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
