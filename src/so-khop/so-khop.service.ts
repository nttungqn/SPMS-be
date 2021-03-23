import { Injectable } from '@nestjs/common';
import { ChiTietNganhDaoTaoService } from 'chi-tiet-nganh-dao-tao/chi-tiet-nganh-dao-tao.service';
import { FilterCTNganhDaoTaoDto } from 'chi-tiet-nganh-dao-tao/dto/filterCTNganhDaoTao.dto';
import { FilterSoKhopNganhDaoTao } from './dto/filter-so-khop.dto';

@Injectable()
export class SoKhopService {
  constructor(private chiTietNganhDaoTaoService: ChiTietNganhDaoTaoService) {}
  async soKhopNganhDaotao(id: number, filter: FilterSoKhopNganhDaoTao) {
    await this.getAllSubject(id, filter.khoaTuyenNam1);
    return;
  }
  async getAllSubject(idNganhDaotao: number, khoa: string) {
    const chiTietNganhDaoTao = await this.chiTietNganhDaoTaoService.findAll({
      limit: 100,
      page: 0,
      khoa: Number(khoa),
      nganhDaoTao: idNganhDaotao
    });
    console.log(chiTietNganhDaoTao[0].id);

    return;
  }
}
