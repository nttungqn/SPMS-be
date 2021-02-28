import { Test, TestingModule } from '@nestjs/testing';
import { ChuanDauRaNganhDaoTaoController } from './chuan-dau-ra-nganh-dao-tao.controller';

describe('ChuanDauRaNganhDaoTaoController', () => {
  let controller: ChuanDauRaNganhDaoTaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChuanDauRaNganhDaoTaoController]
    }).compile();

    controller = module.get<ChuanDauRaNganhDaoTaoController>(ChuanDauRaNganhDaoTaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
