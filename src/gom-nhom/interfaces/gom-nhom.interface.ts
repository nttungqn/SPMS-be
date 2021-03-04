export interface IGomNhom {
  readonly id?: number;
  readonly idLKKT?: number;
  readonly maGN?: number;
  readonly tieuDe?: string;
  readonly stt?: number;
  readonly loaiNhom?: string;
  readonly soTCBB?: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly createdBy?: number;
  readonly updatedBy?: number;
  readonly isDeleted?: boolean;
}
