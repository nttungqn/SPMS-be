const LIMIT = 25;
const TABLE_NAME = {
  USERS: 'users',
  ROLES: 'roles',
  CHUONGTRINHDAOTAO: 'ChuongTrinhDaoTao',
  MONHOC: 'MonHoc',
  NGANHDAOTAO: 'NganhDaoTao',
  SYLLABUS: 'Syllabus',
  CHITIETNGANHDAOTAO: 'ChiTietNganhDaoTao',
  KEHOACHGIANGDAY: 'KeHoachGiangDay',
  LOAIKEHOACHGIANGDAY: 'LoaiKeHoachGiangDay',
  CHUANDAURA: 'ChuanDauRa',
  CHUANDAURANGANHDAOTAO: 'ChuanDauRaNganhDauTao',
  KHOIKIENTHUC: 'KhoiKienThuc',
  LOAIKHOIKIENTHUC: 'LoaiKhoiKienThuc',
  CHUDE: 'ChuDe',
  HOATDONGDAYHOC: 'HoatDongDayHoc',
  GOMNHOM: 'GomNhom',
  CHITIETGOMNHOM: 'ChiTietGomNhom'
};
const EXPIREDIN = 3600;
const SALT = 12;
const MAIL_OPTIONS = {
  DEFAULT_SUBJECT: 'FIT HCMUS'
};
const CONFIRM_SIGNUP_PATH = '/confirm/:token';
const ROLE_SINHVIEN = 1;

const CHUONGTRINHDAOTAO_MESSAGE = {
  CHUONGTRINHDAOTAO_EMPTY: 'CHUONGTRINHDAOTAO_EMPTY',
  CHUONGTRINHDAOTAO_ID_NOT_FOUND: 'CHUONGTRINHDAOTAO_ID_NOT_FOUND',
  CHUONGTRINHDAOTAO_ID_INVALID: 'CHUONGTRINHDAOTAO_ID_INVALID',
  CHUONGTRINHDAOTAO_NAME_OR_CODE_EXIST: 'CHUONGTRINHDAOTAO_NAME_OR_CODE_EXIST',
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
  EMAIL_OR_PASSWORD_INCORRECT: 'EMAIL_OR_PASSWORD_INCORRECT',
  TOKEN_INVALID: 'TOKEN_INVALID',
  VERIFY_ERROR: 'VERIFY_ERROR',
  TOKEN_VERIFED: 'TOKEN_VERIFED',
  VERIFY_FAILED: 'VERIFY_FAILED',
  VERIFY_SUCCESSFULLY: 'VERIFY_SUCCESSFULLY',
  ACCOUNT_NOT_VERIFY: 'ACCOUNT_NOT_VERIFY'
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

const CHUANDAURA_MESSAGE = {
  CHUANDAURA_EMPTY: 'CHUANDAURA_EMPTY',
  CHUANDAURA_ID_NOT_FOUND: 'CHUANDAURA_ID_NOT_FOUND',
  CHUANDAURA_IS_EXIST: 'CHUANDAURA_EXIST',
  CREATE_CHUANDAURA_FAILED: 'CREATE_CHUANDAURA_FAILED',
  CREATE_CHUANDAURA_SUCCESSFULLY: 'CREATE_CHUANDAURA_SUCCESSFULLY',
  UPDATE_CHUANDAURA_FAILED: 'UPDATE_CHUANDAURA_FAILED',
  UPDATE_CHUANDAURA_SUCCESSFULLY: 'UPDATE_CHUANDAURA_SUCCESSFULLY',
  DELETE_CHUANDAURA_FAILED: 'DELETE_CHUANDAURA_FAILED',
  DELETE_CHUANDAURA_SUCCESSFULLY: 'DELETE_CHUANDAURA_SUCCESSFULLY'
};

const CHUANDAURA_NGANHDAOTAO_MESSAGE = {
  CHUANDAURA_NGANHDAOTAO_EMPTY: 'CHUANDAURA_NGANHDAOTAO_EMPTY',
  CHUANDAURA_NGANHDAOTAO_ID_NOT_FOUND: 'CHUANDAURA_NGANHDAOTAO_ID_NOT_FOUND',
  CHUANDAURA_NGANHDAOTAO_IS_EXIST: 'CHUANDAURA_NGANHDAOTAO_EXIST',
  CREATE_CHUANDAURA_NGANHDAOTAO_FAILED: 'CREATE_CHUANDAURA_NGANHDAOTAO_FAILED',
  CREATE_CHUANDAURA_NGANHDAOTAO_SUCCESSFULLY: 'CREATE_CHUANDAURA_NGANHDAOTAO_SUCCESSFULLY',
  UPDATE_CHUANDAURA_NGANHDAOTAO_FAILED: 'UPDATE_CHUANDAURA_NGANHDAOTAO_FAILED',
  UPDATE_CHUANDAURA_NGANHDAOTAO_SUCCESSFULLY: 'UPDATE_CHUANDAURA_NGANHDAOTAO_SUCCESSFULLY',
  DELETE_CHUANDAURA_NGANHDAOTAO_FAILED: 'DELETE_CHUANDAURA_NGANHDAOTAO_FAILED',
  DELETE_CHUANDAURA_NGANHDAOTAO_SUCCESSFULLY: 'DELETE_CHUANDAURA_NGANHDAOTAO_SUCCESSFULLY'
};

const USER_MESSAGE = {
  USER_ID_NOT_FOUND: 'USER_ID_NOT_FOUND',
  UPDATE_USER_FAILED: 'UPDATE_USER_FAILED',
  UPDATE_USER_SUCCESSFULLY: 'UPDATE_USER_SUCCESSFULLY',
  USERS_NOT_AUTHORIZED: 'USERS_NOT_AUTHORIZED',
  PASSWORD_INCORRECT: 'PASSWORD_INCORRECT'
};

export {
  LIMIT,
  TABLE_NAME,
  EXPIREDIN,
  CHUONGTRINHDAOTAO_MESSAGE,
  AUTH_MESSAGE,
  SALT,
  NGANHDAOTAO_MESSAGE,
  CTNGANHDAOTAO_MESSAGE,
  KEHOACHGIANGDAY_MESSAGE,
  CHUANDAURA_MESSAGE,
  CHUANDAURA_NGANHDAOTAO_MESSAGE,
  USER_MESSAGE,
  MAIL_OPTIONS,
  ROLE_SINHVIEN,
  CONFIRM_SIGNUP_PATH
};
