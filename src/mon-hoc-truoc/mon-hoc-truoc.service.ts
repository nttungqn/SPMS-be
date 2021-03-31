import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MonHocTruocEntity } from './entity/mon-hoc-truoc.entity';

@Injectable()
export class MonHocTruocService {
  constructor(
    @InjectRepository(MonHocTruocEntity)
    private monHocTruocRepository: Repository<MonHocTruocEntity>
  ) {}
  async getMonHocThayThe(id: number, khoaMonHocTruoc: number) {
    const results = await this.monHocTruocRepository
      .createQueryBuilder('mhtr')
      .leftJoinAndSelect('mhtr.monHocThayThe', 'monHocThayThe')
      .leftJoin('mhtr.ctndtMonHocTruoc', 'ctndtMonHocTruoc')
      .where((qb) => {
        qb.where('ctndtMonHocTruoc.khoa = :khoa', { khoa: khoaMonHocTruoc });
      })
      .getMany();
    return results.map((e) => e.monHocThayThe);
  }
}
