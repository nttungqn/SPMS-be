export interface IChiTietNganhDaoTao {
  readonly ID?: number;
  readonly Khoa?: number;
  readonly CoHoiNgheNghiep?: string;
  readonly MucTieuChung?: string;
  readonly NganhDaoTao?: number;
  readonly createdAt?: Date;
  readonly createdBy?: number;
  readonly updatedAt?: Date;
  readonly updatedBy?: number;
  readonly isDeleted?: boolean;
}
