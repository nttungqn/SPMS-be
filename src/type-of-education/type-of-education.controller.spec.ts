import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfEducationController } from './type-of-education.controller';
import { TypeOfEducationService } from './type-of-education.service';

describe('TypeOfEducationController', () => {
  let controller: TypeOfEducationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeOfEducationController],
      providers: [TypeOfEducationService]
    }).compile();

    controller = module.get<TypeOfEducationController>(TypeOfEducationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
