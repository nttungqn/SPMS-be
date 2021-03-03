import { Test, TestingModule } from '@nestjs/testing';
import { HeDaotaoController } from './he-dao-tao.controller';
import { HeDaotaoService } from './he-dao-tao.service';

describe('HeDaotaoController', () => {
  let controller: HeDaotaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeDaotaoController],
      providers: [HeDaotaoService]
    }).compile();

    controller = module.get<HeDaotaoController>(HeDaotaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
