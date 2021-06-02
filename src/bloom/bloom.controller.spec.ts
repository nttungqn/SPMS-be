import { Test, TestingModule } from '@nestjs/testing';
import { BloomController } from './bloom.controller';
import { BloomService } from './bloom.service';

describe('BloomController', () => {
  let controller: BloomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BloomController],
      providers: [BloomService]
    }).compile();

    controller = module.get<BloomController>(BloomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
