const LIMIT = 25;
const TABLE_NAME = {
  USERS: 'users',
  ROLES: 'roles',
  CHUONGTRINHDAOTAO: 'ChuongTrinhDaoTao',
  MONHOC: 'MonHoc',
  NGANHDAOTAO: 'NganhDaoTao',
  CHITIETNGANHDAOTAO: 'ChiTietNganhDaoTao',
  KEHOACHGIANGDAY: 'KeHoachGiangDay'
};
const EXPIREDIN = 3600;
const SALT = 12;

const CHUONGTRINHDAOTAO_MESSAGE = {
  CHUONGTRINHDAOTAO_EMPTY: 'CHUONGTRINHDAOTAO_EMPTY',
  CHUONGTRINHDAOTAO_ID_NOT_FOUND: 'CHUONGTRINHDAOTAO_ID_NOT_FOUND',
  CHUONGTRINHDAOTAO_ID_INVALID: 'CHUONGTRINHDAOTAO_ID_INVALID',
  CHUONGTRINHDAOTAO_NAME_EXIST: 'CHUONGTRINHDAOTAO_NAME_EXIST',
  CHUONGTRINHDAOTAO_NOT_AUTHORIZED: 'CHUONGTRINHDAOTAO_NOT_AUTHORIZED',
  CREATE_CHUONGTRINHDAOTAO_FAILED: 'CREATE_CHUONGTRINHDAOTAO_FAILED',
  CREATE_CHUONGTRINHDAOTAO_SUCCESSFULLY: 'CREATE_CHUONGTRINHDAOTAO_SUCCESSFULLY',
  UPDATE_CHUONGTRINHDAOTAO_FAILED: 'UPDATE_CHUONGTRINHDAOTAO_FAILED',
  UPDATE_CHUONGTRINHDAOTAO_SUCCESSFULLY: 'UPDATE_CHUONGTRINHDAOTAO_SUCCESSFULLY',
  DELETE_CHUONGTRINHDAOTAO_FAILED: 'DELETE_CHUONGTRINHDAOTAO_FAILED',
  DELETE_CHUONGTRINHDAOTAO_SUCCESSFULLY: 'DELETE_CHUONGTRINHDAOTAO_SUCCESSFULLY'
};
const AUTH_MESSAGE = {
  EMAIL_NOT_EXIST: 'EMAIL_NOT_EXIST',
  EMAIL_IS_EXIST: 'EMAIL_IS_EXIST',
  LOGIN_FAILED: 'LOGIN_FAILED',
  SIGN_UP_SUCCESSFULLY: 'SIGN_UP_SUCCESSFULLY',
  SIGN_UP_FAILED: 'SIGN_UP_FAILED',
  EMAIL_OR_PASSWORD_INCORRECT: 'EMAIL_OR_PASSWORD_INCORRECT'
};
const NGANHDAOTAO_MESSAGE = {
  NGANHDAOTAO_EMPTY: 'NGANHDAOTAO_EMPTY',
  NGANHDAOTAO_ID_NOT_FOUND: 'NGANHDAOTAO_ID_NOT_FOUND',
  NGANHDAOTAO_ID_INVALID: 'NGANHDAOTAO_ID_INVALID',
  NGANHDAOTAO_NAME_EXIST: 'NGANHDAOTAO_NAME_EXIST',
  NGANHDAOTAO_NOT_AUTHORIZED: 'NGANHDAOTAO_NOT_AUTHORIZED',
  CREATE_NGANHDAOTAO_FAILED: 'CREATE_NGANHDAOTAO_FAILED',
  CREATE_NGANHDAOTAO_SUCCESSFULLY: 'CREATE_NGANHDAOTAO_SUCCESSFULLY',
  UPDATE_NGANHDAOTAO_FAILED: 'UPDATE_NGANHDAOTAO_FAILED',
  UPDATE_NGANHDAOTAO_SUCCESSFULLY: 'UPDATE_NGANHDAOTAO_SUCCESSFULLY',
  DELETE_NGANHDAOTAO_FAILED: 'DELETE_NGANHDAOTAO_FAILED',
  DELETE_NGANHDAOTAO_SUCCESSFULLY: 'DELETE_NGANHDAOTAO_SUCCESSFULLY'
};

const MONHOC_MESSAGE = {
  MONHOC_EMPTY: 'MONHOC_EMPTY',
  MONHOC_ID_NOT_FOUND: 'MONHOC_ID_NOT_FOUND',
  MONHOC_ID_INVALID: 'MONHOC_ID_INVALID',
  MONHOC_NAME_EXIST: 'MONHOC_NAME_EXIST',
  MONHOC_NOT_AUTHORIZED: 'MONHOC_NOT_AUTHORIZED',
  CREATE_MONHOC_FAILED: 'CREATE_MONHOC_FAILED',
  CREATE_MONHOC_SUCCESSFULLY: 'CREATE_MONHOC_SUCCESSFULLY',
  UPDATE_MONHOC_FAILED: 'UPDATE_MONHOC_FAILED',
  UPDATE_MONHOC_SUCCESSFULLY: 'UPDATE_MONHOC_SUCCESSFULLY',
  DELETE_MONHOC_FAILED: 'DELETE_MONHOC_FAILED',
  DELETE_MONHOC_SUCCESSFULLY: 'DELETE_MONHOC_SUCCESSFULLY'
};

const CTNGANHDAOTAO_MESSAGE = {
  CTNGANHDAOTAO_EMPTY: 'CTNGANHDAOTAO_EMPTY',
  CTNGANHDAOTAO_ID_NOT_FOUND: 'CTNGANHDAOTAO_ID_NOT_FOUND',
  CTNGANHDAOTAO_ID_INVALID: 'CTNGANHDAOTAO_ID_INVALID',
  CTNGANHDAOTAO_EXIST: 'CTNGANHDAOTAO_EXIST',
  CTNGANHDAOTAO_NOT_AUTHORIZED: 'CTNGANHDAOTAO_NOT_AUTHORIZED',
  CREATE_CTNGANHDAOTAO_FAILED: 'CREATE_CTNGANHDAOTAO_FAILED',
  CREATE_CTNGANHDAOTAO_SUCCESSFULLY: 'CREATE_CTNGANHDAOTAO_SUCCESSFULLY',
  UPDATE_CTNGANHDAOTAO_FAILED: 'UPDATE_CTNGANHDAOTAO_FAILED',
  UPDATE_CTNGANHDAOTAO_SUCCESSFULLY: 'UPDATE_CTNGANHDAOTAO_SUCCESSFULLY',
  DELETE_CTNGANHDAOTAO_FAILED: 'DELETE_CTNGANHDAOTAO_FAILED',
  DELETE_CTNGANHDAOTAO_SUCCESSFULLY: 'DELETE_CTNGANHDAOTAO_SUCCESSFULLY'
};

const KEHOACHGIANGDAY_MESSAGE = {
  KEHOACHGIANGDAY_EMPTY: 'KEHOACHGIANGDAY_EMPTY',
  KEHOACHGIANGDAY_ID_NOT_FOUND: 'KEHOACHGIANGDAY_ID_NOT_FOUND',
  KEHOACHGIANGDAY_ID_INVALID: 'KEHOACHGIANGDAY_ID_INVALID',
  KEHOACHGIANGDAY_EXIST: 'KEHOACHGIANGDAY_EXIST',
  KEHOACHGIANGDAY_NOT_AUTHORIZED: 'KEHOACHGIANGDAY_NOT_AUTHORIZED',
  CREATE_KEHOACHGIANGDAY_FAILED: 'CREATE_KEHOACHGIANGDAY_FAILED',
  CREATE_KEHOACHGIANGDAY_SUCCESSFULLY: 'CREATE_KEHOACHGIANGDAY_SUCCESSFULLY',
  UPDATE_KEHOACHGIANGDAY_FAILED: 'UPDATE_KEHOACHGIANGDAY_FAILED',
  UPDATE_KEHOACHGIANGDAY_SUCCESSFULLY: 'UPDATE_KEHOACHGIANGDAY_SUCCESSFULLY',
  DELETE_KEHOACHGIANGDAY_FAILED: 'DELETE_KEHOACHGIANGDAY_FAILED',
  DELETE_KEHOACHGIANGDAY_SUCCESSFULLY: 'DELETE_KEHOACHGIANGDAY_SUCCESSFULLY',
  KEHOACHGIANGDAY_MESSAGE_MAKEHOACH_CONFLIC: 'KEHOACHGIANGDAY_MESSAGE_MAKEHOACH_CONFLIC'
};

export {
  LIMIT,
  TABLE_NAME,
  EXPIREDIN,
  CHUONGTRINHDAOTAO_MESSAGE,
  AUTH_MESSAGE,
  SALT,
  MONHOC_MESSAGE,
  NGANHDAOTAO_MESSAGE,
  CTNGANHDAOTAO_MESSAGE,
  KEHOACHGIANGDAY_MESSAGE
};
