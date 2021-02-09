import { BadRequestException } from '@nestjs/common';

export const bodyValidatorMiddleware = async (req: Request, res: Response, next: Function) => {
  if (!req?.body) {
    return next(new BadRequestException(`Bad Request`));
  }
  const { body }: any = req;
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(body?.email)) {
    return next(new BadRequestException(`Email not valid`));
  }
  next();
};
