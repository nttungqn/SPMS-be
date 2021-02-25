import { Test, TestingModule } from '@nestjs/testing';
import { ChiTietNganhDaoTaoController } from './chi-tiet-nganh-dao-tao.controller';

describe('ChiTietNganhDaoTaoController', () => {
  let controller: ChiTietNganhDaoTaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChiTietNganhDaoTaoController]
    }).compile();

    controller = module.get<ChiTietNganhDaoTaoController>(ChiTietNganhDaoTaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
