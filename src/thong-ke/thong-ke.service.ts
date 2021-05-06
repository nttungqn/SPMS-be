import { Injectable } from '@nestjs/common';
import { ChuDeEntity } from 'chu-de/entity/chu-de.entity';
import { ChuanDauRaMonHocEntity } from 'chuan-dau-ra-mon-hoc/entity/chuan-dau-ra-mon-hoc.entity';
import { ChuongTrinhDaoTaoService } from 'chuong-trinh-dao-tao/chuong-trinh-dao-tao.service';
import { CtdtService } from 'ctdt/ctdt.service';
import { Role } from 'guards/roles.enum';
import { MucTieuMonHocEntity } from 'muc-tieu-mon-hoc/entity/muc-tieu-mon-hoc.entity';
import { SyllabusService } from 'syllabus/syllabus.service';
import { Connection, getConnection } from 'typeorm';
import { UsersService } from 'users/users.service';
import { IntroPageInfo } from './dto/intro-page.dto';
import { ThongKeChuanDauRaRow } from './dto/row-thong-ke-chuan-dau-ra.dto';
import { ThongKeGiaoVien } from './dto/thong-ke-giao-vien.dto';
import { RedisCacheService } from 'cache/redisCache.service';
import * as format from 'string-format';
import { REDIS_CACHE_VARS } from 'constant/constant';

@Injectable()
export class ThongKeService {
  constructor(
    private syllabusService: SyllabusService,
    private chuongTrinhDaotaoService: ChuongTrinhDaoTaoService,
    private nganhDaoTaoService: CtdtService,
    private userService: UsersService,
    private cacheManager: RedisCacheService
  ) {}
  async thongKeGiaoVien(idGiaoVien: number): Promise<ThongKeGiaoVien> {
    const key = format(REDIS_CACHE_VARS.THONG_KE_GV_CACHE_KEY, idGiaoVien.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const thongKeGiaoVien = new ThongKeGiaoVien();
      thongKeGiaoVien.totalSyllabus = await this.syllabusService.getCountSyllabus(idGiaoVien);
      result = thongKeGiaoVien;
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.THONG_KE_GV_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }
  async intro(): Promise<IntroPageInfo> {
    const key = REDIS_CACHE_VARS.THONG_KE_INTRO_CACHE_KEY;
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const introPageInfo = new IntroPageInfo();

      introPageInfo.toTalSyllabus = await this.syllabusService.getCountSyllabus();
      introPageInfo.totalStudent = await this.userService.getCountUser(Role.SINHVIEN);
      introPageInfo.totalTeacher = await this.userService.getCountUser(Role.GIAOVIEN);
      introPageInfo.totalCTDDT = await this.chuongTrinhDaotaoService.getCountCTDT();
      introPageInfo.totalNganhDaoTao = await this.nganhDaoTaoService.getCount();
      result = introPageInfo;
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.THONG_KE_INTRO_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }

  async thongKeSoLuongChuanDauRaTrongSyllabus(idSyllabus: number) {
    const key = format(REDIS_CACHE_VARS.THONG_KE_SLCDR_CACHE_KEY, idSyllabus.toString());
    let result = await this.cacheManager.get(key);
    if (typeof result === 'undefined') {
      const isDeleted = false;
      const con: Connection = getConnection();
      await this.syllabusService.findOne(idSyllabus);
      const query = con
        .getRepository(ChuDeEntity)
        .createQueryBuilder('cd')
        .leftJoin('cd.chuanDauRaMonHoc', 'cdrmh', 'cdrmh.isDeleted = :isDeleted', { isDeleted })
        .select('cdrmh.id as idCDRMH')
        .addSelect('cdrmh.idMTMH')
        .addSelect('COUNT(cd.tuan) AS count_tuan')
        .where('cd.idSyllabus = :idSyllabus', { idSyllabus })
        .andWhere('cd.idLKHGD = 2')
        .andWhere('cd.isDeleted = :isDeleted', { isDeleted })
        .groupBy('cdrmh.ma');
      const chuanDauRaMonHocCountByTuan: {
        idCDRMH: number;
        idMTMH: number;
        count_tuan: number;
      }[] = await query.getRawMany();

      // Danh Sách các mục tiêu môn học
      const mucTieuMonHoc = await con
        .getRepository(MucTieuMonHocEntity)
        .find({ isDeleted: false, syllabus: idSyllabus });

      //Danh Sách các chuẩn đầu ra của syllabus
      const chuanDauRaMonHoc = await con
        .getRepository(ChuanDauRaMonHocEntity)
        .createQueryBuilder('cdrmh')
        .leftJoin('cdrmh.mucTieuMonHoc', 'mtmh', 'mtmh.idSyllabus = :idSyllabus and mtmh.isDeleted = :isDeleted', {
          idSyllabus: idSyllabus,
          isDeleted
        })
        .where('cdrmh.isDeleted = :isDeleted', { isDeleted })
        .getMany();

      const chuanDauRaMonHocAnCount = chuanDauRaMonHoc.map((e) => {
        const result = {
          cdrmh: e,
          count: 0
        };
        for (let index = 0; index < chuanDauRaMonHocCountByTuan.length; index++) {
          if (chuanDauRaMonHocCountByTuan[index].idCDRMH === e.id) {
            result.count = Number(chuanDauRaMonHocCountByTuan[index].count_tuan);
            chuanDauRaMonHocCountByTuan.splice(index, 1);
            break;
          }
        }
        return result;
      });

      //Thực hiện gom nhóm các chuẩn đầu ra theo từng mục tiêu môn học
      const list = [];
      let total = 0;
      for (const mtmh of mucTieuMonHoc) {
        const row = new ThongKeChuanDauRaRow();
        row.mucTieuMonHoc = mtmh;
        for (let index = 0; index < chuanDauRaMonHocAnCount.length; index++) {
          if (chuanDauRaMonHocAnCount[index].cdrmh.mucTieuMonHoc === mtmh.id) {
            row.chuanDauRaMonHoc.push(chuanDauRaMonHocAnCount[index]);
            row.count += Number(chuanDauRaMonHocAnCount[index].count);
          }
        }
        list.push(row);
        total += row.count;
      }
      result = { contents: list, total };
      await this.cacheManager.set(key, result, REDIS_CACHE_VARS.THONG_KE_SLCDR_CACHE_TTL);
    }

    if (result && typeof result === 'string') result = JSON.parse(result);
    return result;
  }
}
