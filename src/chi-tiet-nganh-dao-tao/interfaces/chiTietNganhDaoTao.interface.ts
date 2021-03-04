export interface IChiTietNganhDaoTao {
  readonly id?: number;
  readonly khoa?: number;
  readonly coHoiNgheNghiep?: string;
  readonly mucTieuChung?: string;
  readonly nganhDaoTao?: number;
  readonly createdAt?: Date;
  readonly createdBy?: number;
  readonly updatedAt?: Date;
  readonly updatedBy?: number;
  readonly isDeleted?: boolean;
}
