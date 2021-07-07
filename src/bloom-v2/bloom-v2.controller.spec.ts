import { Test, TestingModule } from '@nestjs/testing';
import { BloomV2Controller } from './bloom-v2.controller';
import { BloomV2Service } from './bloom-v2.service';

describe('BloomV2Controller', () => {
  let controller: BloomV2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BloomV2Controller],
      providers: [BloomV2Service],
    }).compile();

    controller = module.get<BloomV2Controller>(BloomV2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
