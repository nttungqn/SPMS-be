export interface INganhDaoTao {
  readonly id: number;
  maNganhDaoTao: string;
  readonly ten: string;
  readonly chuongTrinhDaoTao: number;
  readonly createdAt?: Date;
  readonly createdBy?: number;
  readonly updatedAt?: Date;
  readonly updatedBy?: number;
  readonly isDeleted?: boolean;
}
