import { Injectable, NotFoundException } from '@nestjs/common';
import { ChiTietGomNhomEntity } from 'chi-tiet-gom-nhom/entity/chi-tiet-gom-nhom.entity';
import { ChiTietNganhDaoTaoEntity } from 'chi-tiet-nganh-dao-tao/entity/chiTietNganhDaoTao.entity';
import { GomNhomEntity } from 'gom-nhom/entity/gom-nhom.entity';
import { KeHoachGiangDayEntity } from 'ke-hoach-giang-day/entity/keHoachGiangDay.entity';
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
        qb.leftJoinAndSelect('kkt.loaiKhoiKienThuc', 'lkkt', 'lkkt.isDeleted = false');
        qb.where((qb) => {
          qb.leftJoinAndSelect('lkkt.gomNhom', 'gomNhom', `gomNhom.isDeleted = ${false}`).where((qb) => {
            qb.leftJoinAndSelect('gomNhom.chiTietGomNhom', 'chiTietGomNhom').where((qb) => {
              qb.leftJoinAndSelect('chiTietGomNhom.monHoc', 'monHoc');
            });
          });
        });
      })
      .andWhere(`kkt.chiTietNganh = :idCTNDT`, { idCTNDT })
      .andWhere(`kkt.isDeleted = ${false}`)
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
  async KeHoachGiangDayClone(idCTNDTClone: number, idCTNDT: number) {
    const chiTietGomNhomReposi = this.conection.getRepository(ChiTietGomNhomEntity);
    const ctgn = await chiTietGomNhomReposi
      .createQueryBuilder('ctgn')
      .leftJoinAndSelect('ctgn.gomNhom', 'gn', 'gn.isDeleted = false')
      .leftJoinAndSelect('ctgn.monHoc', 'monHoc')
      .where((qb) => {
        qb.leftJoin('gn.loaiKhoiKienThuc', 'lkkt', 'lkkt.isDeleted = false').where((qb) => {
          qb.leftJoin('lkkt.khoiKienThuc', 'kkt', 'kkt.isDeleted = false').andWhere('kkt.chiTietNganh = :idCTNDT', {
            idCTNDT
          });
        });
      })
      .andWhere('ctgn.isDeleted = false')
      .getMany();

    const keHoachGiangDayReposi = this.conection.getRepository(KeHoachGiangDayEntity);

    const khgd = await keHoachGiangDayReposi
      .createQueryBuilder('khgd')
      .leftJoinAndSelect('khgd.chiTietKeHoach', 'ctkh', 'ctkh.isDeleted = false')
      .where((qb) => {
        qb.leftJoinAndSelect('ctkh.chiTietGomNhom', 'ctgn', 'ctgn.isDeleted = false').where((qb) => {
          qb.leftJoinAndSelect('ctgn.monHoc', 'monHoc').leftJoinAndSelect('ctgn.gomNhom', 'gn', 'gn.isDeleted = false');
        });
      })
      .andWhere('khgd.isDeleted = false')
      .andWhere('khgd.nganhDaoTao = :idCTNDT', { idCTNDT })
      .getMany();

    let khgdCurent: KeHoachGiangDayEntity[];
    if (khgd.length > 0) {
      khgdCurent = khgd;
    } else {
      const khgdClone = await keHoachGiangDayReposi
        .createQueryBuilder('khgd')
        .leftJoinAndSelect('khgd.chiTietKeHoach', 'ctkh', 'ctkh.isDeleted = false')
        .where((qb) => {
          qb.leftJoinAndSelect('ctkh.chiTietGomNhom', 'ctgn', 'ctgn.isDeleted = false').where((qb) => {
            qb.leftJoinAndSelect('ctgn.monHoc', 'monHoc').leftJoinAndSelect(
              'ctgn.gomNhom',
              'gn',
              'gn.isDeleted = false'
            );
          });
        })
        .andWhere('khgd.isDeleted = false')
        .andWhere('khgd.nganhDaoTao = :idCTNDTClone', { idCTNDTClone })
        .getMany();
      khgdCurent = khgdClone;
    }

    for (const khgdE of khgdCurent) {
      for (const ctkhE of khgdE.chiTietKeHoach) {
        const length = ctgn.length;
        let index = 0;
        for (; index < length; index++) {
          if (ctkhE.chiTietGomNhom.monHoc.id == ctgn[index].monHoc.id) {
            ctkhE.chiTietGomNhom = ctgn[index];
            ctgn.splice(index, 1);
            break;
          }
        }
        if (index == length) {
          ctkhE.chiTietGomNhom = null;
        }
      }
    }
    return { khgd: khgdCurent, chiTietGomNhom: ctgn };
  }
  async deleteKhoiKienThuc(idKKT: number) {
    try {
      const khoiKienThuc = await this.conection.getRepository(ChiTietGomNhomEntity).delete(idKKT);
    } catch (error) {
      console.log(error);
    }
  }
}
