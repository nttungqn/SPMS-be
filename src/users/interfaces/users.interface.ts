export interface IUser {
  readonly id?: number;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly role?: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly isActive?: boolean;
  readonly isDeleted?: boolean;
}
