import { Test, TestingModule } from '@nestjs/testing';
import { BloomV2Service } from './bloom-v2.service';

describe('BloomV2Service', () => {
  let service: BloomV2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BloomV2Service],
    }).compile();

    service = module.get<BloomV2Service>(BloomV2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
