export interface IChuongTrinhDaoTao {
  readonly id?: number;
  readonly maCTDT?: string;
  readonly loaiHinh?: string;
  readonly ten?: string;
  readonly trinhDo?: string;
  readonly tongTinChi?: number;
  readonly doiTuong?: string;
  readonly quiTrinhDaoTao?: string;
  readonly dieuKienTotNghiep?: string;
  readonly createdAt?: Date;
  readonly createdBy?: number;
  readonly updatedAt?: Date;
  readonly updatedBy?: number;
  readonly isDeleted?: boolean;
}
