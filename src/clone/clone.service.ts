import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ChiTietGomNhomService } from 'chi-tiet-gom-nhom/chi-tiet-gom-nhom.service';
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
  constructor(private conection: Connection, private ctgnService: ChiTietGomNhomService) {
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
      .leftJoinAndSelect('ctndt.khoiKienThucList', 'kkt', 'kkt.isDeleted = false')
      .where({ id: idCTNDT, isDeleted: false })
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
        cdrlv1.children?.forEach((cdrlv2) => {
          indexLv2++;
          keptProperties(cdrlv2, 'ma', 'chuanDauRa', 'children');
          keptProperties(cdrlv2.chuanDauRa, 'id');
          cdrlv2.nganhDaoTao = idCTNDT;
          cdrlv2.createdBy = user.id;
          cdrlv2.updatedBy = user.id;
          cdrlv2.ma = `${indexLv1}.${indexLv2}`;
          let indexLv3 = 0;
          cdrlv2.children?.forEach((cdrlv3) => {
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
  async ChiTietNganhDaoTaoClone(idCTNDTClone: number, idCTNDT: number) {
    //const chiTietNganhDaoTaoRepository = this.conection.getRepository(ChiTietNganhDaoTaoEntity);
    const chuanDauRaRepository = this.conection.getRepository(ChuanDauRaNganhDaoTaoEntity);
    const khoiKienThucRepository = this.conection.getRepository(KhoiKienThucEntity);
    const keHoachGiangDayRepository = this.conection.getRepository(KeHoachGiangDayEntity);

    const khoiKienThucListClone = await khoiKienThucRepository
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

    const chuanDauRaListClone = await chuanDauRaRepository
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
      .where('cdr.parent is null and cdr.nganhDaoTao = :idCTNDTClone', { idCTNDTClone })
      .getMany();

    const khgdClone = await keHoachGiangDayRepository
      .createQueryBuilder('khgd')
      .leftJoinAndSelect('khgd.chiTietKeHoach', 'ctkh', 'ctkh.isDeleted = false')
      .where((qb) => {
        qb.leftJoinAndSelect('ctkh.chiTietGomNhom', 'ctgn', 'ctgn.isDeleted = false').where((qb) => {
          qb.leftJoinAndSelect('ctgn.monHoc', 'monHoc').leftJoinAndSelect('ctgn.gomNhom', 'gn', 'gn.isDeleted = false');
        });
      })
      .andWhere('khgd.isDeleted = false')
      .andWhere('khgd.nganhDaoTao = :idCTNDTClone', { idCTNDTClone })
      .getMany();
    // Xử lý dữ liệu khoiKienThucListClone
    khoiKienThucListClone?.forEach((kktE) => {
      kktE.chiTietNganh = idCTNDT;
      keptProperties(
        kktE,
        'chiTietNganh',
        'maKKT',
        'ten',
        'tinChiTuChon',
        'tinChiBatBuoc',
        'tinChiTuChonTuDo',
        'ghiChu',
        'tongTinChi',
        'loaiKhoiKienThuc'
      );
      kktE.loaiKhoiKienThuc?.forEach((lkktE) => {
        keptProperties(lkktE, 'maLoaiKhoiKienThuc', 'ten', 'tongTinChi', 'noidung', 'gomNhom');
        lkktE.gomNhom?.forEach((gnE) => {
          keptProperties(gnE, 'maGN', 'tieuDe', 'stt', 'loaiNhom', 'soTCBB', 'chiTietGomNhom');
          gnE.chiTietGomNhom?.forEach((ctgnE) => {
            removeProperties(ctgnE, 'id', 'idGN', 'ctgnMonHoctruoc', 'gomNhom', 'createdAt', 'updatedAt', 'isDeleted');
          });
        });
      });
    });
    // Xử lý dữ liệu chuanDauRaListClone
    chuanDauRaListClone?.forEach((cdrlv1) => {
      keptProperties(cdrlv1, 'ma', 'chuanDauRa', 'children');
      cdrlv1.children?.forEach((cdrlv2) => {
        keptProperties(cdrlv2, 'ma', 'chuanDauRa', 'children');
        cdrlv2.children?.forEach((cdrlv3) => {
          keptProperties(cdrlv3, 'ma', 'chuanDauRa');
        });
      });
    });
    khgdClone?.forEach((khgdE) => {
      keptProperties(khgdE, 'maKeHoach', 'tenHocKy', 'sTT', 'nganhDaoTao', 'chiTietKeHoach');
      khgdE.chiTietKeHoach?.forEach((ctkhE) => {
        keptProperties(ctkhE, 'ghiChu', 'chiTietGomNhom');
        keptProperties(ctkhE.chiTietGomNhom, 'ghiChu', 'gomNhom', 'monHoc');
        removeProperties(ctkhE.chiTietGomNhom.gomNhom, 'isDeleted', 'createdAt', 'updatedAt', 'id');
        removeProperties(ctkhE.chiTietGomNhom.monHoc, 'updatedAt', 'createdAt', 'isDeleted');
      });
    });
    return { chuanDauRa: chuanDauRaListClone, khoiKienThuc: khoiKienThucListClone, keHoachGiangDay: khgdClone };
  }

  async CreateChiTietNganhDaoTao(
    chuanDauRaList: ChuanDauRaNganhDaoTaoEntity[],
    khoiKienThucList: KhoiKienThucEntity[],
    keHoachGiangDayList: KeHoachGiangDayEntity[],
    idCTNDT: number,
    user: UsersEntity
  ) {
    const queryRunner = this.conection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const ctndtRepository = queryRunner.manager.getRepository(ChiTietNganhDaoTaoEntity);
    const ctndt = await ctndtRepository
      .createQueryBuilder('ctndt')
      .leftJoinAndSelect('ctndt.keHoachGiangDayList', 'khgd')
      .leftJoinAndSelect('ctndt.chuanDaura', 'chuanDaura')
      .leftJoinAndSelect('ctndt.khoiKienThucList', 'khoiKienThucList')
      .where({ id: idCTNDT })
      .getOne();
    if (ctndt.chuanDaura.length > 0 || ctndt.keHoachGiangDayList.length > 0 || ctndt.khoiKienThucList.length > 0) {
      queryRunner.release();
      throw new BadRequestException(CLONE_MESSAGE.CONTENT_EXISTED);
    }
    if (chuanDauRaList.length === 0) {
      queryRunner.release();
      throw new BadRequestException(CLONE_MESSAGE.CHUAN_DAU_RA_NOT_EMPTY);
    }
    if (khoiKienThucList.length === 0) {
      queryRunner.release();
      throw new BadRequestException(CLONE_MESSAGE.KHOI_KIEN_THUC_NOT_EMPTY);
    }
    if (keHoachGiangDayList.length === 0) {
      queryRunner.release();
      throw new BadRequestException(CLONE_MESSAGE.KE_HOACH_GIANG_DAY_NOT_EMPTY);
    }
    try {
      // Xử lý chuẩn đầu ra
      let indexLv1 = 0;
      for (const cdrlv1 of chuanDauRaList || []) {
        indexLv1++;
        keptProperties(cdrlv1, 'ma', 'chuanDauRa', 'children');
        keptProperties(cdrlv1.chuanDauRa, 'id');
        cdrlv1.nganhDaoTao = idCTNDT;
        cdrlv1.createdBy = user.id;
        cdrlv1.updatedBy = user.id;
        cdrlv1.ma = `${indexLv1}`;
        let indexLv2 = 0;
        for (const cdrlv2 of cdrlv1?.children || []) {
          indexLv2++;
          keptProperties(cdrlv2, 'ma', 'chuanDauRa', 'children');
          keptProperties(cdrlv2.chuanDauRa, 'id');
          cdrlv2.nganhDaoTao = idCTNDT;
          cdrlv2.createdBy = user.id;
          cdrlv2.updatedBy = user.id;
          cdrlv2.ma = `${indexLv1}.${indexLv2}`;
          let indexLv3 = 0;
          for (const cdrlv3 of cdrlv2?.children || []) {
            indexLv3++;
            keptProperties(cdrlv3, 'ma', 'chuanDauRa'); //Chỉ áp dụng 3 cấp
            keptProperties(cdrlv3.chuanDauRa, 'id');
            cdrlv3.nganhDaoTao = idCTNDT;
            cdrlv3.createdBy = user.id;
            cdrlv3.updatedBy = user.id;
            cdrlv3.ma = `${indexLv1}.${indexLv2}.${indexLv3}`;
          }
        }
      }
      //Save Chuẩn đầu ra
      //ctndt.chuanDaura = chuanDauRaList;
      //await ctndtRepository.save(ctndt);
      //delete ctndt.chuanDaura;
      await queryRunner.manager.getRepository(ChuanDauRaNganhDaoTaoEntity).save(chuanDauRaList);
      // xử lý khối kiến thức
      for (const kktE of khoiKienThucList  || []) {
        kktE.chiTietNganh = Number(idCTNDT);
        kktE.createdBy = user.id;
        kktE.updatedBy = user.id;
        removeProperties(kktE, 'id', 'createdAt', 'updatedAt', 'isDeleted');
        for (const lkktE of kktE?.loaiKhoiKienThuc  || []) {
          lkktE.createdBy = user.id;
          lkktE.updatedBy = user.id;
          removeProperties(lkktE, 'id', 'isDeleted');
          for (const gnE of lkktE?.gomNhom  || []) {
            gnE.createdBy = user.id;
            gnE.updatedBy = user.id;
            removeProperties(gnE, 'id', 'idLKKT', 'loaiKhoiKienThuc', 'createdAt', 'updatedAt', 'isDeleted');
            for (const ctgnE of gnE?.chiTietGomNhom || []) {
              ctgnE.createdBy = user.id;
              ctgnE.updatedBy = user.id;
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
            }
            gnE.chiTietGomNhom = gnE.chiTietGomNhom.filter((ctgnE) => ctgnE.idMH != null);
          }
          lkktE.gomNhom = lkktE.gomNhom.filter((gnE) => gnE.chiTietGomNhom.length >= 0);
        }
      }

      // save khối kiến thức
      // ctndt.khoiKienThucList = khoiKienThucList;
      // const results = await ctndtRepository.save(ctndt);

      // const ctgnArr: ChiTietGomNhomEntity[] = [];
      // for (const kktE of results.khoiKienThucList) {
      //   for (const lkktK of kktE.loaiKhoiKienThuc) {
      //     for (const gnE of lkktK.gomNhom) {
      //       for (const ctgnE of gnE.chiTietGomNhom) {
      //         ctgnArr.push(ctgnE);
      //       }
      //     }
      //   }
      // }
      // delete ctndt.khoiKienThucList;

      const results = await queryRunner.manager.getRepository(KhoiKienThucEntity).save(khoiKienThucList);
      const ctgnArr: ChiTietGomNhomEntity[] = [];
      for (const kktE of results || []) {
        for (const lkktK of kktE?.loaiKhoiKienThuc || []) {
          for (const gnE of lkktK?.gomNhom || []) {
            for (const ctgnE of gnE?.chiTietGomNhom || []) {
              ctgnArr.push(ctgnE);
            }
          }
        }
      }
      // Xử lý Kế hoạch giảng dạy
      for (const khgdE of keHoachGiangDayList || []) {
        khgdE.nganhDaoTao = Number(idCTNDT);
        khgdE.createdBy = user.id;
        khgdE.updatedBy = user.id;
        removeProperties(khgdE, 'id', 'createdAt', 'updatedAt', 'isDeleted');
        khgdE.chiTietKeHoach = khgdE.chiTietKeHoach.filter((ctkhE) => {
          ctkhE.createdBy = user.id;
          ctkhE.updatedBy = user.id;
          const length = ctgnArr.length;
          let index = 0;
          for (; index < length; index++) {
            if (ctgnArr[index].idMH === ctkhE.chiTietGomNhom.monHoc.id) {
              ctkhE.idCTGN = ctgnArr[index].id;
              break;
            }
          }
          if (index === length && length != 0) {
            // id môn học trong kế hoạch giảng dạy không nàm trong nội dung
            throw new BadRequestException();
          }
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
      //save Kế hoạch giảng dạy
      // ctndt.keHoachGiangDayList = keHoachGiangDayList;
      // await ctndtRepository.save(ctndt);
      await queryRunner.manager.getRepository(KeHoachGiangDayEntity).save(keHoachGiangDayList);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) {
        throw new BadRequestException(CLONE_MESSAGE.MON_HOC_NOT_EXIST_IN_KHOI_KIEN_THUC);
      }
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
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
