import { Test, TestingModule } from '@nestjs/testing';
import { NamHocController } from './nam-hoc.controller';
import { NamHocService } from './nam-hoc.service';

describe('NamHocController', () => {
  let controller: NamHocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NamHocController],
      providers: [NamHocService]
    }).compile();

    controller = module.get<NamHocController>(NamHocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
