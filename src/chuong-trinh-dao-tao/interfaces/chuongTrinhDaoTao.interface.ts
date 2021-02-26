export interface IChuongTrinhDaoTao {
  readonly ID?: number;
  readonly MaCTDT?: string;
  readonly LoaiHinh?: string;
  readonly Ten?: string;
  readonly TrinhDo?: string;
  readonly TongTinChi?: number;
  readonly DoiTuong?: string;
  readonly QuiTrinhDaoTao?: string;
  readonly DieuKienTotNghiep?: string;
  readonly createdAt?: Date;
  readonly createdBy?: number;
  readonly updatedAt?: Date;
  readonly updatedBy?: number;
  readonly isDeleted?: boolean;
}
