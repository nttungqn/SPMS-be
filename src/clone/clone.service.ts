import { Injectable, NotFoundException } from '@nestjs/common';
import { ChiTietNganhDaoTaoEntity } from 'chi-tiet-nganh-dao-tao/entity/chiTietNganhDaoTao.entity';
import { KhoiKienThucEntity } from 'khoi-kien-thuc/entity/khoi-kien-thuc.entity';
import { LoaiKhoiKienThucEntity } from 'loai-khoi-kien-thuc/entity/type-of-knowledge-block.entity';
import { Connection, getConnection } from 'typeorm';

@Injectable()
export class CloneService {
  constructor(private conection: Connection) {
    conection = getConnection();
  }
  async khoiKienThucClone(idCTNDTClone: number, idCTNDT: number) {
    const khoiKineThucRepository = this.conection.getRepository(KhoiKienThucEntity);
    const khoiKienThucList = await khoiKineThucRepository.find({ where: { chiTietNganh: idCTNDT, isDeleted: false } });
    if (khoiKienThucList.length != 0) {
      return khoiKienThucList;
    }
    const khoiKienThucCloneList = await khoiKineThucRepository.find({
      where: { chiTietNganh: idCTNDTClone, isDeleted: false }
    });
    khoiKienThucCloneList.forEach((e) => {
      e.chiTietNganh = idCTNDT;
      delete e.id;
    });
    return khoiKienThucCloneList;
  }

  async updateKhoiKienThuc(khoikienThucList: KhoiKienThucEntity[], idCTNDT: number) {
    const ctndt = await this.conection
      .getRepository(ChiTietNganhDaoTaoEntity)
      .createQueryBuilder('ctndt')
      .leftJoinAndSelect('ctndt.khoiKienThucList', 'kkt')
      .where({ id: idCTNDT })
      .getOne();
    ctndt.khoiKienThucList = khoikienThucList;
    if (!ctndt) {
      throw new NotFoundException();
    }
    await this.conection.getRepository(ChiTietNganhDaoTaoEntity).save(ctndt);
  }
  async LoaiKhoiKienThucDetailClone(idCTNDTClone: number, idCTNDT: number) {
    const loaiKhoiKienThucList = await this.conection
      .getRepository(LoaiKhoiKienThucEntity)
      .createQueryBuilder('lkkt')
      .leftJoinAndSelect('lkkt.gomNhom', 'gomNhom', `gomNhom.isDeleted = ${false}`)
      .leftJoinAndSelect('lkkt.khoiKienThuc', 'khoiKienThuc', `khoiKienThuc.isDeleted = ${false}`)
      .where((qb) => {
        qb.leftJoinAndSelect('gomNhom.chiTietGomNhom', 'chiTietGomNhom').where((qb) => {
          qb.leftJoinAndSelect('chiTietGomNhom.monHoc', 'monHoc');
        });
      })
      .andWhere(`lkkt.khoiKienThuc = :idCTNDTClone`, { idCTNDTClone })
      .andWhere(`lkkt.isDeleted = ${false}`)
      .getMany();
    loaiKhoiKienThucList.forEach((lkkt) => {
      delete lkkt.id;
      lkkt.khoiKienThuc = null;
      lkkt.gomNhom.forEach((gn) => {
        delete gn.id;
        delete gn.loaiKhoiKienThuc;
        delete gn.idLKKT;
        gn.chiTietGomNhom.forEach((ctgn) => {
          delete ctgn.id;
          delete ctgn.idGN;
          delete ctgn.gomNhom;
        });
      });
    });
    const khoiKienThuc = await this.conection
      .getRepository(KhoiKienThucEntity)
      .createQueryBuilder('kkt')
      .where((qb) => {
        qb.leftJoinAndSelect('kkt.loaiKhoiKienThuc', 'lkkt', 'lkkt.isDeleted = false')
          .leftJoinAndSelect('lkkt.gomNhom', 'gomNhom', `gomNhom.isDeleted = ${false}`)
          .where((qb) => {
            qb.leftJoinAndSelect('gomNhom.chiTietGomNhom', 'chiTietGomNhom').where((qb) => {
              qb.leftJoinAndSelect('chiTietGomNhom.monHoc', 'monHoc');
            });
          });
      })
      .andWhere(`lkkt.khoiKienThuc = :idCTNDT`, { idCTNDT })
      .andWhere(`lkkt.isDeleted = ${false}`)
      .getMany();

    return { KhoiKienThuc: khoiKienThuc, LoaiKhoiKienThucClone: loaiKhoiKienThucList };
  }
  async updateLoaiKhoiKienThucDetailClone(
    loaiKhoiKienThucList: LoaiKhoiKienThucEntity[],
    idCTNDTClone: number,
    idCTNDT: number
  ) {
    const loaiKhoiKienThucReposi = await this.conection
      .getRepository(LoaiKhoiKienThucEntity)
      .save(loaiKhoiKienThucList);
  }
}
