export interface IChiTietGomNhom {
  readonly id?: number;
  readonly idGN?: number;
  readonly idMH?: number;
  readonly ghiChu?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly createdBy?: number;
  readonly updatedBy?: number;
  readonly isDeleted?: boolean;
}
