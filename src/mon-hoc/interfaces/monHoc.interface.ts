export interface IMonHoc {
  readonly ID?: number;
  readonly Ma?: string;
  readonly TenTiengViet?: string;
  readonly TenTiengAnh?: string;
  readonly SoTinChi?: number;
  readonly SoTietThucHanh?: number;
  readonly SoTietTuHoc?: number;
  readonly MoTa?: string;
  readonly TaiNguyen?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly createdBy?: number;
  readonly updatedBy?: number;
  readonly isDeleted?: boolean;
}
