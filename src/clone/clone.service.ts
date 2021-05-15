import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { ChiTietGomNhomEntity } from 'chi-tiet-gom-nhom/entity/chi-tiet-gom-nhom.entity';
import { ChiTietNganhDaoTaoEntity } from 'chi-tiet-nganh-dao-tao/entity/chiTietNganhDaoTao.entity';
import { ChuanDauRaNganhDaoTaoEntity } from 'chuan-dau-ra-nganh-dao-tao/entity/chuanDauRaNganhDaoTao.entity';
import { CLONE_MESSAGE, NGANHDAOTAO_MESSAGE } from 'constant/constant';
import { KeHoachGiangDayEntity } from 'ke-hoach-giang-day/entity/keHoachGiangDay.entity';
import { KhoiKienThucEntity } from 'khoi-kien-thuc/entity/khoi-kien-thuc.entity';
import { Connection, getConnection } from 'typeorm';
import { UsersEntity } from 'users/entity/user.entity';

@Injectable()
export class CloneService {
  constructor(private conection: Connection) {
    conection = getConnection();
  }
  async khoiKienThucDetailClone(idCTNDTClone: number, idCTNDT: number) {
    const khoiKineThucRepository = this.conection.getRepository(KhoiKienThucEntity);
    const khoiKienThucList = await khoiKineThucRepository
      .createQueryBuilder('kkt')
      .leftJoinAndSelect('kkt.loaiKhoiKienThuc', 'lkkt', 'lkkt.isDeleted = false')
      .where((qb) => {
        qb.leftJoinAndSelect('lkkt.gomNhom', 'gn', 'gn.isDeleted = false').where((qb) => {
          qb.leftJoinAndSelect('gn.chiTietGomNhom', 'ctgn', 'ctgn.isDeleted = false').where((qb) => {
            qb.leftJoinAndSelect('ctgn.monHoc', 'mh');
          });
        });
      })
      .andWhere('kkt.chiTietNganh = :idCTNDT', { idCTNDT })
      .andWhere('kkt.isDeleted = false')
      .getMany();
    if (khoiKienThucList.length != 0) {
      return khoiKienThucList;
    }
    const khoiKienThucListClone = await khoiKineThucRepository
      .createQueryBuilder('kkt')
      .leftJoinAndSelect('kkt.loaiKhoiKienThuc', 'lkkt', 'lkkt.isDeleted = false')
      .where((qb) => {
        qb.leftJoinAndSelect('lkkt.gomNhom', 'gn', 'gn.isDeleted = false').where((qb) => {
          qb.leftJoinAndSelect('gn.chiTietGomNhom', 'ctgn', 'ctgn.isDeleted = false').where((qb) => {
            qb.leftJoinAndSelect('ctgn.monHoc', 'mh');
          });
        });
      })
      .andWhere('kkt.chiTietNganh = :idCTNDTClone', { idCTNDTClone })
      .andWhere('kkt.isDeleted = false')
      .getMany();
    khoiKienThucListClone.forEach((kktE) => {
      kktE.chiTietNganh = idCTNDT;
      removeProperties(kktE, 'createdAt', 'updatedAt', 'isDeleted');
      kktE.loaiKhoiKienThuc.forEach((lkktE) => {
        delete lkktE.id;
        lkktE.gomNhom.forEach((gnE) => {
          removeProperties(gnE, 'id', 'idLKKT', 'loaiKhoiKienThuc', 'createdAt', 'updatedAt', 'isDeleted');
          gnE.chiTietGomNhom.forEach((ctgnE) => {
            removeProperties(ctgnE, 'id', 'idGN', 'ctgnMonHoctruoc', 'gomNhom', 'createdAt', 'updatedAt', 'isDeleted');
          });
        });
      });
    });
    return khoiKienThucListClone;
  }

  async createKhoiKienThucDetailClone(
    khoiKienThucList: KhoiKienThucEntity[],
    idCTNDTClone: number,
    idCTNDT: number,
    createdBy: number
  ) {
    const ctndt = await this.conection
      .getRepository(ChiTietNganhDaoTaoEntity)
      .createQueryBuilder('ctndt')
      .leftJoinAndSelect('ctndt.khoiKienThucList', 'kkt')
      .where({ id: idCTNDT })
      .getOne();
    if (!ctndt) {
      throw new NotFoundException();
    }
    if (ctndt.khoiKienThucList.length > 0) {
      throw new BadRequestException('KHOI_KIEN_THUC_EXISTED');
    }
    khoiKienThucList.forEach((kktE) => {
      kktE.chiTietNganh = Number(idCTNDT);
      kktE.createdBy = createdBy;
      kktE.updatedBy = createdBy;
      removeProperties(kktE, 'id', 'createdAt', 'updatedAt', 'isDeleted');
      kktE.loaiKhoiKienThuc.forEach((lkktE) => {
        lkktE.createdBy = createdBy;
        lkktE.updatedBy = createdBy;
        removeProperties(lkktE, 'id', 'isDeleted');
        lkktE.gomNhom.forEach((gnE) => {
          gnE.createdBy = createdBy;
          gnE.updatedBy = createdBy;
          removeProperties(gnE, 'id', 'idLKKT', 'loaiKhoiKienThuc', 'createdAt', 'updatedAt', 'isDeleted');
          gnE.chiTietGomNhom.forEach((ctgnE) => {
            ctgnE.createdBy = createdBy;
            ctgnE.updatedBy = createdBy;
            removeProperties(
              ctgnE,
              'id',
              'idGN',
              'ctgnMonHoctruoc',
              'gomNhom',
              'createdAt',
              'updatedAt',
              'monHoc',
              'isDeleted'
            );
          });
          gnE.chiTietGomNhom = gnE.chiTietGomNhom.filter((ctgnE) => ctgnE.idMH != null);
        });
        lkktE.gomNhom = lkktE.gomNhom.filter((gnE) => gnE.chiTietGomNhom.length >= 0);
      });
    });
    ctndt.khoiKienThucList = khoiKienThucList;
    try {
      await this.conection.getRepository(ChiTietNganhDaoTaoEntity).save(ctndt);
    } catch (error) {
      throw new InternalServerErrorException(CLONE_MESSAGE.CREATE_NOI_DUNG_FAILED);
    }
  }

  async KeHoachGiangDayClone(idCTNDTClone: number, idCTNDT: number) {
    const chiTietGomNhomReposi = this.conection.getRepository(ChiTietGomNhomEntity);
    const query = chiTietGomNhomReposi
      .createQueryBuilder('ctgn')
      .leftJoinAndSelect('ctgn.gomNhom', 'gn', 'gn.isDeleted = false')
      .leftJoinAndSelect('ctgn.monHoc', 'monHoc')
      .where((qb) => {
        qb.leftJoin('gn.loaiKhoiKienThuc', 'lkkt', 'lkkt.isDeleted = false').where((qb) => {
          qb.leftJoin('lkkt.khoiKienThuc', 'kkt', 'kkt.isDeleted = false').where((qb) => {
            qb.where('kkt.chiTietNganh = :idCTNDT', { idCTNDT });
          });
        });
      })
      .andWhere('ctgn.isDeleted = false');
    const ctgn = await query.getMany();
    if (ctgn.length == 0) {
      throw new BadRequestException(CLONE_MESSAGE.MON_HOC_EMPTY);
    }
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
    let deleteIdFlag = true;
    if (khgd.length > 0) {
      khgdCurent = khgd;
      deleteIdFlag = false;
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
      removeProperties(khgdE, 'createdAt', 'updatedAt', 'isDeleted');
      if (deleteIdFlag) {
        removeProperties(khgdE, 'createdAt', 'id');
        khgdE.nganhDaoTao = Number(idCTNDT);
      }
      for (const ctkhE of khgdE.chiTietKeHoach) {
        if (deleteIdFlag) {
          removeProperties(ctkhE, 'idKHGD', 'idCTGN', 'id', 'createdAt', 'updatedAt', 'isDeleted');
        }
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
      khgdE.chiTietKeHoach = khgdE.chiTietKeHoach.filter((ctkhE) => ctkhE.chiTietGomNhom != null);
      if (khgdE.chiTietKeHoach.length == 0) {
        khgdE.chiTietKeHoach.push({ idCTGN: null, ghiChu: null });
      }
    }
    return { khgd: khgdCurent, chiTietGomNhom: ctgn };
  }

  async createKeHoachGiangDayClone(
    keHoachGiangDayList: KeHoachGiangDayEntity[],
    idCTNDTClone: number,
    idCTNDT: number,
    createdBy: number
  ) {
    const ctndt = await this.conection
      .getRepository(ChiTietNganhDaoTaoEntity)
      .createQueryBuilder('ctndt')
      .leftJoinAndSelect('ctndt.keHoachGiangDayList', 'khgd')
      .where({ id: idCTNDT })
      .getOne();
    if (!ctndt) {
      throw new NotFoundException();
    }
    if (ctndt.keHoachGiangDayList.length > 0) {
      throw new BadRequestException(CLONE_MESSAGE.KE_HOACH_GIANG_DAY_EXISTED);
    }
    for (const khgdE of keHoachGiangDayList) {
      khgdE.nganhDaoTao = Number(idCTNDT);
      khgdE.createdBy = createdBy;
      khgdE.updatedBy = createdBy;
      removeProperties(khgdE, 'id', 'createdAt', 'updatedAt', 'isDeleted');
      khgdE.chiTietKeHoach = khgdE.chiTietKeHoach.filter((ctkhE) => {
        ctkhE.createdBy = createdBy;
        ctkhE.updatedBy = createdBy;
        ctkhE.idCTGN = ctkhE.chiTietGomNhom.id;
        removeProperties(
          ctkhE,
          'idKHGD',
          'id',
          'chiTietKeHoach',
          'createdAt',
          'updatedAt',
          'isDeleted',
          'chiTietGomNhom'
        );
        return Number.isInteger(ctkhE.idCTGN);
      });
    }
    try {
      const keHoachGiangDayReposi = this.conection.getRepository(KeHoachGiangDayEntity);
      keHoachGiangDayReposi.save(keHoachGiangDayList);
    } catch (error) {
      return new InternalServerErrorException(CLONE_MESSAGE.CREATE_KE_HOACH_GIANG_DAY_FAILED);
    }
  }

  async chuanDauRaNganhDaoTaoClone(idCTNDTClone: number, idCTNDT: number) {
    const chuanDauRaList = await this.conection
      .getRepository(ChuanDauRaNganhDaoTaoEntity)
      .createQueryBuilder('cdr')
      .leftJoinAndSelect('cdr.chuanDauRa', 'cdrName')
      .leftJoinAndSelect('cdr.children', 'clv1')
      .where((qb) => {
        qb.leftJoinAndSelect('clv1.chuanDauRa', 'cdrNameLv1')
          .leftJoinAndSelect('clv1.children', 'clv2')
          .where((qb) => {
            qb.leftJoinAndSelect('clv2.chuanDauRa', 'cdrNameLv2');
          });
      })
      .where('cdr.parent is null and cdr.nganhDaoTao = :idCTNDT', { idCTNDT })
      .getMany();
    if (chuanDauRaList.length > 0) {
      return chuanDauRaList;
    }
    const query = this.conection
      .getRepository(ChuanDauRaNganhDaoTaoEntity)
      .createQueryBuilder('cdr')
      .leftJoinAndSelect('cdr.chuanDauRa', 'cdrName')
      .leftJoinAndSelect('cdr.children', 'clv1')
      .where((qb) => {
        qb.leftJoinAndSelect('clv1.chuanDauRa', 'cdrNameLv1')
          .leftJoinAndSelect('clv1.children', 'clv2')
          .where((qb) => {
            qb.leftJoinAndSelect('clv2.chuanDauRa', 'cdrNameLv2');
          });
      })
      .where('cdr.parent is null and cdr.nganhDaoTao = :idCTNDTClone', { idCTNDTClone });
    const chuanDauRaListClone = await query.getMany();

    chuanDauRaListClone.forEach((cdrlv1) => {
      keptProperties(cdrlv1, 'ma', 'chuanDauRa', 'children');
      cdrlv1.children.forEach((cdrlv2) => {
        keptProperties(cdrlv2, 'ma', 'chuanDauRa', 'children');
        cdrlv2.children.forEach((cdrlv3) => {
          keptProperties(cdrlv3, 'ma', 'chuanDauRa');
        });
      });
    });
    return chuanDauRaListClone;
  }

  async createChuanDauRaNganhDaoTaoClone(
    chuanDauRaList: ChuanDauRaNganhDaoTaoEntity[],
    idCTNDTClone: number,
    idCTNDT: number,
    user: UsersEntity
  ) {
    const ctndt = await this.conection
      .getRepository(ChiTietNganhDaoTaoEntity)
      .createQueryBuilder('ctndt')
      .leftJoinAndSelect('ctndt.chuanDaura', 'cdr')
      .where({ id: idCTNDT })
      .getOne();
    if (!ctndt) {
      throw new NotFoundException(NGANHDAOTAO_MESSAGE.NGANHDAOTAO_ID_NOT_FOUND);
    }
    if (ctndt.chuanDaura.length > 0) {
      throw new BadRequestException(CLONE_MESSAGE.CHUAN_DAU_RA_EXITSTED);
    }
    try {
      let indexLv1 = 0;
      chuanDauRaList.forEach((cdrlv1) => {
        indexLv1++;
        keptProperties(cdrlv1, 'ma', 'chuanDauRa', 'children');
        keptProperties(cdrlv1.chuanDauRa, 'id');
        cdrlv1.nganhDaoTao = idCTNDT;
        cdrlv1.createdBy = user.id;
        cdrlv1.updatedBy = user.id;
        cdrlv1.ma = `${indexLv1}`;
        let indexLv2 = 0;
        cdrlv1.children.forEach((cdrlv2) => {
          indexLv2++;
          keptProperties(cdrlv2, 'ma', 'chuanDauRa', 'children');
          keptProperties(cdrlv2.chuanDauRa, 'id');
          cdrlv2.nganhDaoTao = idCTNDT;
          cdrlv2.createdBy = user.id;
          cdrlv2.updatedBy = user.id;
          cdrlv2.ma = `${indexLv1}.${indexLv2}`;
          let indexLv3 = 0;
          cdrlv2.children.forEach((cdrlv3) => {
            indexLv3++;
            keptProperties(cdrlv3, 'ma', 'chuanDauRa'); //Chỉ áp dụng 3 cấp
            keptProperties(cdrlv3.chuanDauRa, 'id');
            cdrlv3.nganhDaoTao = idCTNDT;
            cdrlv3.createdBy = user.id;
            cdrlv3.updatedBy = user.id;
            cdrlv3.ma = `${indexLv1}.${indexLv2}.${indexLv3}`;
          });
        });
      });
    } catch (error) {
      throw new BadRequestException();
    }
    ctndt.chuanDaura = chuanDauRaList;
    try {
      await this.conection.getRepository(ChiTietNganhDaoTaoEntity).save(ctndt);
    } catch (error) {
      return new InternalServerErrorException(CLONE_MESSAGE.CREATE_KE_HOACH_GIANG_DAY_FAILED);
    }
  }
  async deleteKhoiKienThuc(idKKT: number) {
    try {
      await this.conection.getRepository(ChiTietGomNhomEntity).delete(idKKT);
    } catch (error) {}
  }
}
const removeProperties = (object: any, ...keys: any[]) => {
  keys.forEach((key) => {
    delete object[key];
  });
};
const keptProperties = (obj: any, ...keys: any[]) => {
  Object.keys(obj).forEach((k) => {
    if (!keys.includes(k)) {
      delete obj[k];
    }
  });
};
