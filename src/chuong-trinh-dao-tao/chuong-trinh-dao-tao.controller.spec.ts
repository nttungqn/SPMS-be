import { Test, TestingModule } from '@nestjs/testing';
import { ChuongTrinhDaoTaoController } from './chuong-trinh-dao-tao.controller';

describe('ChuongTrinhDaoTaoController', () => {
  let controller: ChuongTrinhDaoTaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChuongTrinhDaoTaoController]
    }).compile();

    controller = module.get<ChuongTrinhDaoTaoController>(ChuongTrinhDaoTaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
