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
  LOAIDANHGIA: 'LoaiDanhGia',
  GOMNHOM: 'GomNhom',
  CHITIETGOMNHOM: 'ChiTietGomNhom',
  MUCTIEUMONHOC: 'MucTieuMonHoc',
  CHITIETKEHOACH: 'ChiTietKeHoach',
  NAMHOC: 'NamHoc',
  HEDAOTAO: 'HeDaoTao',
  MONHOCTIENQUYET: 'MonHoc_MonHocTienQuyet',
  CHUANDAURAMONHOC: 'ChuanDauRaMonHoc',
  HOATDONGDANHGIA: 'HoatDongDanhGia',
  HOATDONGDANHGIA_CHUANDAURAMONHOC: 'HoatDongDanhGia_ChuanDauRaMonHoc',
  LOAIDANHGIA_CHUANDAURAMONHOC: 'LoaiDanhGia_ChuanDauRaMonHoc',
  CHUDE_HOATDONGDANHGIA: 'ChuDe_HoatDongDanhGia',
  CHUDE_CHUANDAURAMONHOC: 'ChuDe_ChuanDauRaMonHoc',
  CHUDE_HOATDONGDAYHOC: 'ChuDe_HoatDongDayHoc',
  MONHOCTRUOC: 'MonHocTruocV2',
  PERMISSION: 'permission',
  RESOURCE: 'resources',
  BLOOM: 'bloom'
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
  TOKEN_VERIFIED: 'TOKEN_VERIFIED',
  VERIFY_FAILED: 'VERIFY_FAILED',
  VERIFY_SUCCESSFULLY: 'VERIFY_SUCCESSFULLY',
  ACCOUNT_NOT_VERIFY: 'ACCOUNT_NOT_VERIFY',
  ACCOUNT_NOT_FOUND: 'ACCOUNT_NOT_FOUND',
  LINK_NOT_FOUND: 'LINK_NOT_FOUND',
  SOME_THING_WENT_WRONG: 'SOME_THING_WENT_WRONG',
  PASSWORD_NOT_MATCH: 'PASSWORD AND PASSWORD CONFIRM NOT MATCH'
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
  DELETE_CTNGANHDAOTAO_SUCCESSFULLY: 'DELETE_CTNGANHDAOTAO_SUCCESSFULLY',
  CTNGANHDAOTAO_FOREIGN_KEY_NOT_FOUND: 'CTNGANHDAOTAO_FOREIGN_KEY_NOT_FOUND'
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
  PASSWORD_INCORRECT: 'PASSWORD_INCORRECT',
  DELETE_USER_FAILED: 'DELETE_USER_FAILED',
  DELETE_ALL_USER_FAILED: 'DELETE_ALL_USER_FAILED',
  DELETE_USER_SUCCESSFULLY: 'DELETE_USER_SUCCESSFULLY',
  DELETE_ALL_USER_SUCCESSFULLY: 'DELETE_ALL_USER_SUCCESSFULLY',
  USER_ID_INVALID: 'USER_ID_INVALID',
  USER_EXIST: 'USER_EXIST',
  USER_NOT_AUTHORIZED: 'USER_NOT_AUTHORIZED',
  INTERAL_SERVER_ERROR: 'INTERAL_SERVER_ERROR'
};

const MUCTIEUMONHOC_MESSAGE = {
  MUCTIEUMONHOC_EMPTY: 'MUCTIEUMONHOC_EMPTY',
  MUCTIEUMONHOC_ID_NOT_FOUND: 'MUCTIEUMONHOC_ID_NOT_FOUND',
  MUCTIEUMONHOC_ID_INVALID: 'MUCTIEUMONHOC_ID_INVALID',
  MUCTIEUMONHOC_EXIST: 'MUCTIEUMONHOC_EXIST',
  MUCTIEUMONHOC_NOT_AUTHORIZED: 'MUCTIEUMONHOC_NOT_AUTHORIZED',
  CREATE_MUCTIEUMONHOC_FAILED: 'CREATE_MUCTIEUMONHOC_FAILED',
  CREATE_MUCTIEUMONHOC_SUCCESSFULLY: 'CREATE_MUCTIEUMONHOC_SUCCESSFULLY',
  UPDATE_MUCTIEUMONHOC_FAILED: 'UPDATE_MUCTIEUMONHOC_FAILED',
  UPDATE_MUCTIEUMONHOC_SUCCESSFULLY: 'UPDATE_MUCTIEUMONHOC_SUCCESSFULLY',
  DELETE_MUCTIEUMONHOC_FAILED: 'DELETE_MUCTIEUMONHOC_FAILED',
  DELETE_MUCTIEUMONHOC_SUCCESSFULLY: 'DELETE_MUCTIEUMONHOC_SUCCESSFULLY'
};
const LOAIDANHGIA_MESSAGE = {
  LOAIDANHGIA_EMPTY: 'LOAIDANHGIA_EMPTY',
  LOAIDANHGIA_ID_NOT_FOUND: 'LOAIDANHGIA_ID_NOT_FOUND',
  LOAIDANHGIA_ID_INVALID: 'LOAIDANHGIA_ID_INVALID',
  LOAIDANHGIA_EXIST: 'LOAIDANHGIA_EXIST',
  LOAIDANHGIA_NOT_AUTHORIZED: 'LOAIDANHGIA_NOT_AUTHORIZED',
  CREATE_LOAIDANHGIA_FAILED: 'CREATE_LOAIDANHGIA_FAILED',
  CREATE_LOAIDANHGIA_SUCCESSFULLY: 'CREATE_LOAIDANHGIA_SUCCESSFULLY',
  UPDATE_LOAIDANHGIA_FAILED: 'UPDATE_LOAIDANHGIA_FAILED',
  UPDATE_LOAIDANHGIA_SUCCESSFULLY: 'UPDATE_LOAIDANHGIA_SUCCESSFULLY',
  DELETE_LOAIDANHGIA_FAILED: 'DELETE_LOAIDANHGIA_FAILED',
  DELETE_LOAIDANHGIA_SUCCESSFULLY: 'DELETE_LOAIDANHGIA_SUCCESSFULLY'
};

const SYLLABUS_MESSAGE = {
  SYLLABUS_EMPTY: 'SYLLABUS_EMPTY',
  SYLLABUS_ID_NOT_FOUND: 'SYLLABUS_ID_NOT_FOUND',
  SYLLABUS_ID_INVALID: 'SYLLABUS_ID_INVALID',
  SYLLABUS_EXIST: 'SYLLABUS_EXIST',
  SYLLABUS_NOT_AUTHORIZED: 'SYLLABUS_NOT_AUTHORIZED',
  CREATE_SYLLABUS_FAILED: 'CREATE_SYLLABUS_FAILED',
  CREATE_SYLLABUS_SUCCESSFULLY: 'CREATE_SYLLABUS_SUCCESSFULLY',
  UPDATE_SYLLABUS_FAILED: 'UPDATE_SYLLABUS_FAILED',
  UPDATE_SYLLABUS_SUCCESSFULLY: 'UPDATE_SYLLABUS_SUCCESSFULLY',
  DELETE_SYLLABUS_FAILED: 'DELETE_SYLLABUS_FAILED',
  DELETE_SYLLABUS_SUCCESSFULLY: 'DELETE_SYLLABUS_SUCCESSFULLY'
};

const NAMHOC_MESSAGE = {
  NAMHOC_EMPTY: 'NAMHOC_EMPTY',
  NAMHOC_ID_NOT_FOUND: 'NAMHOC_ID_NOT_FOUND',
  NAMHOC_ID_INVALID: 'NAMHOC_ID_INVALID',
  NAMHOC_EXIST: 'NAMHOC_EXIST',
  NAMHOC_NOT_AUTHORIZED: 'NAMHOC_NOT_AUTHORIZED',
  CREATE_NAMHOC_FAILED: 'CREATE_NAMHOC_FAILED',
  CREATE_NAMHOC_SUCCESSFULLY: 'CREATE_NAMHOC_SUCCESSFULLY',
  UPDATE_NAMHOC_FAILED: 'UPDATE_NAMHOC_FAILED',
  UPDATE_NAMHOC_SUCCESSFULLY: 'UPDATE_NAMHOC_SUCCESSFULLY',
  DELETE_NAMHOC_FAILED: 'DELETE_NAMHOC_FAILED',
  DELETE_NAMHOC_SUCCESSFULLY: 'DELETE_NAMHOC_SUCCESSFULLY'
};

const HEDAOTAO_MESSAGE = {
  HEDAOTAO_EMPTY: 'HEDAOTAO_EMPTY',
  HEDAOTAO_ID_NOT_FOUND: 'HEDAOTAO_ID_NOT_FOUND',
  HEDAOTAO_ID_INVALID: 'HEDAOTAO_ID_INVALID',
  HEDAOTAO_EXIST: 'HEDAOTAO_EXIST',
  HEDAOTAO_NOT_AUTHORIZED: 'HEDAOTAO_NOT_AUTHORIZED',
  CREATE_HEDAOTAO_FAILED: 'CREATE_HEDAOTAO_FAILED',
  CREATE_HEDAOTAO_SUCCESSFULLY: 'CREATE_HEDAOTAO_SUCCESSFULLY',
  UPDATE_HEDAOTAO_FAILED: 'UPDATE_HEDAOTAO_FAILED',
  UPDATE_HEDAOTAO_SUCCESSFULLY: 'UPDATE_HEDAOTAO_SUCCESSFULLY',
  DELETE_HEDAOTAO_FAILED: 'DELETE_HEDAOTAO_FAILED',
  DELETE_HEDAOTAO_SUCCESSFULLY: 'DELETE_HEDAOTAO_SUCCESSFULLY'
};

const KHOIKIENTHUC_MESSAGE = {
  KHOIKIENTHUC_EMPTY: 'KHOIKIENTHUC_EMPTY',
  KHOIKIENTHUC_ID_NOT_FOUND: 'KHOIKIENTHUC_ID_NOT_FOUND',
  KHOIKIENTHUC_ID_INVALID: 'KHOIKIENTHUC_ID_INVALID',
  KHOIKIENTHUC_EXIST: 'KHOIKIENTHUC_EXIST',
  KHOIKIENTHUC_NOT_AUTHORIZED: 'KHOIKIENTHUC_NOT_AUTHORIZED',
  ID_CHI_TIET_NGANH_DAO_TAO: 'ID_CHI_TIET_NGANH_DAO_TAO_NOT_FOUND',
  CREATE_KHOIKIENTHUC_FAILED: 'CREATE_KHOIKIENTHUC_FAILED',
  CREATE_KHOIKIENTHUC_SUCCESSFULLY: 'CREATE_KHOIKIENTHUC_SUCCESSFULLY',
  UPDATE_KHOIKIENTHUC_FAILED: 'UPDATE_KHOIKIENTHUC_FAILED',
  UPDATE_KHOIKIENTHUC_SUCCESSFULLY: 'UPDATE_KHOIKIENTHUC_SUCCESSFULLY',
  DELETE_KHOIKIENTHUC_FAILED: 'DELETE_KHOIKIENTHUC_FAILED',
  DELETE_KHOIKIENTHUC_SUCCESSFULLY: 'DELETE_KHOIKIENTHUC_SUCCESSFULLY'
};
const LOAIKHOIKIENTHUC_MESSAGE = {
  LOAIKHOIKIENTHUC_EMPTY: 'LOAIKHOIKIENTHUC_EMPTY',
  LOAIKHOIKIENTHUC_ID_NOT_FOUND: 'LOAIKHOIKIENTHUC_ID_NOT_FOUND',
  LOAIKHOIKIENTHUC_ID_INVALID: 'LOAIKHOIKIENTHUC_ID_INVALID',
  LOAIKHOIKIENTHUC_EXIST: 'LOAIKHOIKIENTHUC_EXIST',
  LOAIKHOIKIENTHUC_NOT_AUTHORIZED: 'LOAIKHOIKIENTHUC_NOT_AUTHORIZED',
  CREATE_LOAIKHOIKIENTHUC_FAILED: 'CREATE_LOAIKHOIKIENTHUC_FAILED',
  CREATE_LOAIKHOIKIENTHUC_SUCCESSFULLY: 'CREATE_LOAIKHOIKIENTHUC_SUCCESSFULLY',
  UPDATE_LOAIKHOIKIENTHUC_FAILED: 'UPDATE_LOAIKHOIKIENTHUC_FAILED',
  UPDATE_LOAIKHOIKIENTHUC_SUCCESSFULLY: 'UPDATE_LOAIKHOIKIENTHUC_SUCCESSFULLY',
  DELETE_LOAIKHOIKIENTHUC_FAILED: 'DELETE_LOAIKHOIKIENTHUC_FAILED',
  DELETE_LOAIKHOIKIENTHUC_SUCCESSFULLY: 'DELETE_LOAIKHOIKIENTHUC_SUCCESSFULLY'
};

const MONHOCTIENQUYET_MESSAGE = {
  MONHOCTIENQUYET_EMPTY: 'MONHOCTIENQUYET_EMPTY',
  MONHOCTIENQUYET_ID_NOT_FOUND: 'MONHOCTIENQUYET_ID_NOT_FOUND',
  MONHOCTIENQUYET_ID_INVALID: 'MONHOCTIENQUYET_ID_INVALID',
  MONHOCTIENQUYET_EXIST: 'MONHOCTIENQUYET_EXIST',
  MONHOCTIENQUYET_NOT_AUTHORIZED: 'MONHOCTIENQUYET_NOT_AUTHORIZED',
  CREATE_MONHOCTIENQUYET_FAILED: 'CREATE_MONHOCTIENQUYET_FAILED',
  CREATE_MONHOCTIENQUYET_SUCCESSFULLY: 'CREATE_MONHOCTIENQUYET_SUCCESSFULLY',
  UPDATE_MONHOCTIENQUYET_FAILED: 'UPDATE_MONHOCTIENQUYET_FAILED',
  UPDATE_MONHOCTIENQUYET_SUCCESSFULLY: 'UPDATE_MONHOCTIENQUYET_SUCCESSFULLY',
  DELETE_MONHOCTIENQUYET_FAILED: 'DELETE_MONHOCTIENQUYET_FAILED',
  DELETE_MONHOCTIENQUYET_SUCCESSFULLY: 'DELETE_MONHOCTIENQUYET_SUCCESSFULLY'
};

const RESPONSE_MESSAGE = {
  FOREIGN_KEY_CONFLICT: 'FOREIGN_KEY_CONFLICT',
  SUCCESS: 'OK'
};

const CHITIETKEHOACH_MESSAGE = {
  CHITIETKEHOACH_EMPTY: 'CHITIETKEHOACH_EMPTY',
  CHITIETKEHOACH_ID_NOT_FOUND: 'CHITIETKEHOACH_ID_NOT_FOUND',
  CHITIETKEHOACH_ID_INVALID: 'CHITIETKEHOACH_ID_INVALID',
  CHITIETKEHOACH_EXIST: 'CHITIETKEHOACH_EXIST',
  CHITIETKEHOACH_FOREIGN_KEY_CONFLICT: 'CHITIETKEHOACH_FOREIGN_KEY_CONFLICT',
  CHITIETKEHOACH_NOT_AUTHORIZED: 'CHITIETKEHOACH_NOT_AUTHORIZED',
  CREATE_CHITIETKEHOACH_FAILED: 'CREATE_CHITIETKEHOACH_FAILED',
  CREATE_CHITIETKEHOACH_SUCCESSFULLY: 'CREATE_CHITIETKEHOACH_SUCCESSFULLY',
  UPDATE_CHITIETKEHOACH_FAILED: 'UPDATE_CHITIETKEHOACH_FAILED',
  UPDATE_CHITIETKEHOACH_SUCCESSFULLY: 'UPDATE_CHITIETKEHOACH_SUCCESSFULLY',
  DELETE_CHITIETKEHOACH_FAILED: 'DELETE_CHITIETKEHOACH_FAILED',
  DELETE_CHITIETKEHOACH_SUCCESSFULLY: 'DELETE_CHITIETKEHOACH_SUCCESSFULLY',
  CHITIETKEHOACH_FOREIGN_KEY_NOT_FOUND: 'CHITIETKEHOACH_FOREIGN_KEY_NOT_FOUND'
};

const MONHOC_MESSAGE = {
  MONHOC_EMPTY: 'MONHOC_EMPTY',
  MONHOC_ID_NOT_FOUND: 'MONHOC_ID_NOT_FOUND',
  MONHOC_ID_INVALID: 'MONHOC_ID_INVALID',
  MONHOC_EXIST: 'MONHOC_EXIST',
  MONHOC_FOREIGN_KEY_CONFLICT: 'MONHOC_FOREIGN_KEY_CONFLICT',
  MONHOC_NOT_AUTHORIZED: 'MONHOC_NOT_AUTHORIZED',
  CREATE_MONHOC_FAILED: 'CREATE_MONHOC_FAILED',
  CREATE_MONHOC_SUCCESSFULLY: 'CREATE_MONHOC_SUCCESSFULLY',
  UPDATE_MONHOC_FAILED: 'UPDATE_MONHOC_FAILED',
  UPDATE_MONHOC_SUCCESSFULLY: 'UPDATE_MONHOC_SUCCESSFULLY',
  DELETE_MONHOC_FAILED: 'DELETE_MONHOC_FAILED',
  DELETE_MONHOC_SUCCESSFULLY: 'DELETE_MONHOC_SUCCESSFULLY',
  IMPORT_INPUT_INVALID: 'INPUT_INVALID',
  IMPORT_SUCCESSFULLY: 'IMPORT_SUCCESSFULLY',
  IMPORT_FAILED: 'IMPORT_FAILED'
};

const CHITIETGOMNHOM_MESSAGE = {
  CHITIETGOMNHOM_EMPTY: 'CHITIETGOMNHOM_EMPTY',
  CHITIETGOMNHOM_ID_NOT_FOUND: 'CHITIETGOMNHOM_ID_NOT_FOUND',
  CHITIETGOMNHOM_ID_INVALID: 'CHITIETGOMNHOM_ID_INVALID',
  CHITIETGOMNHOM_EXIST: 'CHITIETGOMNHOM_EXIST',
  CHITIETGOMNHOM_FOREIGN_KEY_CONFLICT: 'CHITIETGOMNHOM_FOREIGN_KEY_CONFLICT',
  CHITIETGOMNHOM_NOT_AUTHORIZED: 'CHITIETGOMNHOM_NOT_AUTHORIZED',
  CREATE_CHITIETGOMNHOM_FAILED: 'CREATE_CHITIETGOMNHOM_FAILED',
  CREATE_CHITIETGOMNHOM_SUCCESSFULLY: 'CREATE_CHITIETGOMNHOM_SUCCESSFULLY',
  UPDATE_CHITIETGOMNHOM_FAILED: 'UPDATE_CHITIETGOMNHOM_FAILED',
  UPDATE_CHITIETGOMNHOM_SUCCESSFULLY: 'UPDATE_CHITIETGOMNHOM_SUCCESSFULLY',
  DELETE_CHITIETGOMNHOM_FAILED: 'DELETE_CHITIETGOMNHOM_FAILED',
  DELETE_CHITIETGOMNHOM_SUCCESSFULLY: 'DELETE_CHITIETGOMNHOM_SUCCESSFULLY',
  CHITIETGOMNHOM_FOREIGN_KEY_NOT_FOUND: 'CHITIETGOMNHOM_FOREIGN_KEY_NOT_FOUND'
};

const CHUDE_MESSAGE = {
  CHUDE_EMPTY: 'CHUDE_EMPTY',
  CHUDE_ID_NOT_FOUND: 'CHUDE_ID_NOT_FOUND',
  CHUDE_ID_INVALID: 'CHUDE_ID_INVALID',
  CHUDE_EXIST: 'CHUDE_EXIST',
  CHUDE_FOREIGN_KEY_CONFLICT: 'CHUDE_FOREIGN_KEY_CONFLICT',
  CHUDE_NOT_AUTHORIZED: 'CHUDE_NOT_AUTHORIZED',
  CREATE_CHUDE_FAILED: 'CREATE_CHUDE_FAILED',
  CREATE_CHUDE_SUCCESSFULLY: 'CREATE_CHUDE_SUCCESSFULLY',
  UPDATE_CHUDE_FAILED: 'UPDATE_CHUDE_FAILED',
  UPDATE_CHUDE_SUCCESSFULLY: 'UPDATE_CHUDE_SUCCESSFULLY',
  DELETE_CHUDE_FAILED: 'DELETE_CHUDE_FAILED',
  DELETE_CHUDE_SUCCESSFULLY: 'DELETE_CHUDE_SUCCESSFULLY',
  CHUDE_FOREIGN_KEY_NOT_FOUND: 'CHUDE_FOREIGN_KEY_NOT_FOUND',
  CHUDE_INPUT_ARRAY_INVALIAD: 'CHUDE_INPUT_ARRAY_INVALIAD'
};

const GOMNHOM_MESSAGE = {
  GOMNHOM_EMPTY: 'GOMNHOM_EMPTY',
  GOMNHOM_ID_NOT_FOUND: 'GOMNHOM_ID_NOT_FOUND',
  GOMNHOM_ID_INVALID: 'GOMNHOM_ID_INVALID',
  GOMNHOM_EXIST: 'GOMNHOM_EXIST',
  GOMNHOM_FOREIGN_KEY_CONFLICT: 'GOMNHOM_FOREIGN_KEY_CONFLICT',
  GOMNHOM_NOT_AUTHORIZED: 'GOMNHOM_NOT_AUTHORIZED',
  CREATE_GOMNHOM_FAILED: 'CREATE_GOMNHOM_FAILED',
  CREATE_GOMNHOM_SUCCESSFULLY: 'CREATE_GOMNHOM_SUCCESSFULLY',
  UPDATE_GOMNHOM_FAILED: 'UPDATE_GOMNHOM_FAILED',
  UPDATE_GOMNHOM_SUCCESSFULLY: 'UPDATE_GOMNHOM_SUCCESSFULLY',
  DELETE_GOMNHOM_FAILED: 'DELETE_GOMNHOM_FAILED',
  DELETE_GOMNHOM_SUCCESSFULLY: 'DELETE_GOMNHOM_SUCCESSFULLY'
};

const HOATDONGDAYHOC_MESSAGE = {
  HOATDONGDAYHOC_EMPTY: 'HOATDONGDAYHOC_EMPTY',
  HOATDONGDAYHOC_ID_NOT_FOUND: 'HOATDONGDAYHOC_ID_NOT_FOUND',
  HOATDONGDAYHOC_ID_INVALID: 'HOATDONGDAYHOC_ID_INVALID',
  HOATDONGDAYHOC_EXIST: 'HOATDONGDAYHOC_EXIST',
  HOATDONGDAYHOC_FOREIGN_KEY_CONFLICT: 'HOATDONGDAYHOC_FOREIGN_KEY_CONFLICT',
  HOATDONGDAYHOC_NOT_AUTHORIZED: 'HOATDONGDAYHOC_NOT_AUTHORIZED',
  CREATE_HOATDONGDAYHOC_FAILED: 'CREATE_HOATDONGDAYHOC_FAILED',
  CREATE_HOATDONGDAYHOC_SUCCESSFULLY: 'CREATE_HOATDONGDAYHOC_SUCCESSFULLY',
  UPDATE_HOATDONGDAYHOC_FAILED: 'UPDATE_HOATDONGDAYHOC_FAILED',
  UPDATE_HOATDONGDAYHOC_SUCCESSFULLY: 'UPDATE_HOATDONGDAYHOC_SUCCESSFULLY',
  DELETE_HOATDONGDAYHOC_FAILED: 'DELETE_HOATDONGDAYHOC_FAILED',
  DELETE_HOATDONGDAYHOC_SUCCESSFULLY: 'DELETE_HOATDONGDAYHOC_SUCCESSFULLY'
};

const LOAIKEHOACHGIANGDAY_MESSAGE = {
  LOAIKEHOACHGIANGDAY_EMPTY: 'LOAIKEHOACHGIANGDAY_EMPTY',
  LOAIKEHOACHGIANGDAY_ID_NOT_FOUND: 'LOAIKEHOACHGIANGDAY_ID_NOT_FOUND',
  LOAIKEHOACHGIANGDAY_ID_INVALID: 'LOAIKEHOACHGIANGDAY_ID_INVALID',
  LOAIKEHOACHGIANGDAY_EXIST: 'LOAIKEHOACHGIANGDAY_EXIST',
  LOAIKEHOACHGIANGDAY_FOREIGN_KEY_CONFLICT: 'LOAIKEHOACHGIANGDAY_FOREIGN_KEY_CONFLICT',
  LOAIKEHOACHGIANGDAY_NOT_AUTHORIZED: 'LOAIKEHOACHGIANGDAY_NOT_AUTHORIZED',
  CREATE_LOAIKEHOACHGIANGDAY_FAILED: 'CREATE_LOAIKEHOACHGIANGDAY_FAILED',
  CREATE_LOAIKEHOACHGIANGDAY_SUCCESSFULLY: 'CREATE_LOAIKEHOACHGIANGDAY_SUCCESSFULLY',
  UPDATE_LOAIKEHOACHGIANGDAY_FAILED: 'UPDATE_LOAIKEHOACHGIANGDAY_FAILED',
  UPDATE_LOAIKEHOACHGIANGDAY_SUCCESSFULLY: 'UPDATE_LOAIKEHOACHGIANGDAY_SUCCESSFULLY',
  DELETE_LOAIKEHOACHGIANGDAY_FAILED: 'DELETE_LOAIKEHOACHGIANGDAY_FAILED',
  DELETE_LOAIKEHOACHGIANGDAY_SUCCESSFULLY: 'DELETE_LOAIKEHOACHGIANGDAY_SUCCESSFULLY'
};

const CHUANDAURAMONHOC_MESSAGE = {
  CHUANDAURAMONHOC_EMPTY: 'CHUANDAURAMONHOC_EMPTY',
  CHUANDAURAMONHOC_ID_NOT_FOUND: 'CHUANDAURAMONHOC_ID_NOT_FOUND',
  CHUANDAURAMONHOC_ID_INVALID: 'CHUANDAURAMONHOC_ID_INVALID',
  CHUANDAURAMONHOC_EXIST: 'CHUANDAURAMONHOC_EXIST',
  CHUANDAURAMONHOC_FOREIGN_KEY_CONFLICT: 'CHUANDAURAMONHOC_FOREIGN_KEY_CONFLICT',
  CHUANDAURAMONHOC_NOT_AUTHORIZED: 'CHUANDAURAMONHOC_NOT_AUTHORIZED',
  CREATE_CHUANDAURAMONHOC_FAILED: 'CREATE_CHUANDAURAMONHOC_FAILED',
  CREATE_CHUANDAURAMONHOC_SUCCESSFULLY: 'CREATE_CHUANDAURAMONHOC_SUCCESSFULLY',
  UPDATE_CHUANDAURAMONHOC_FAILED: 'UPDATE_CHUANDAURAMONHOC_FAILED',
  UPDATE_CHUANDAURAMONHOC_SUCCESSFULLY: 'UPDATE_CHUANDAURAMONHOC_SUCCESSFULLY',
  DELETE_CHUANDAURAMONHOC_FAILED: 'DELETE_CHUANDAURAMONHOC_FAILED',
  DELETE_CHUANDAURAMONHOC_SUCCESSFULLY: 'DELETE_CHUANDAURAMONHOC_SUCCESSFULLY',
  CHUANDAURAMONHOC_MUCDO_IN_I_T_U: 'CHUANDAURAMONHOC_MUCDO_IN_I_T_U'
};

const HOATDONGDANHGIA_MESSAGE = {
  HOATDONGDANHGIA_EMPTY: 'HOATDONGDANHGIA_EMPTY',
  HOATDONGDANHGIA_ID_NOT_FOUND: 'HOATDONGDANHGIA_ID_NOT_FOUND',
  HOATDONGDANHGIA_ID_INVALID: 'HOATDONGDANHGIA_ID_INVALID',
  HOATDONGDANHGIA_EXIST: 'HOATDONGDANHGIA_EXIST',
  HOATDONGDANHGIA_FOREIGN_KEY_CONFLICT: 'HOATDONGDANHGIA_FOREIGN_KEY_CONFLICT',
  HOATDONGDANHGIA_NOT_AUTHORIZED: 'HOATDONGDANHGIA_NOT_AUTHORIZED',
  CREATE_HOATDONGDANHGIA_FAILED: 'CREATE_HOATDONGDANHGIA_FAILED',
  CREATE_HOATDONGDANHGIA_SUCCESSFULLY: 'CREATE_HOATDONGDANHGIA_SUCCESSFULLY',
  UPDATE_HOATDONGDANHGIA_FAILED: 'UPDATE_HOATDONGDANHGIA_FAILED',
  UPDATE_HOATDONGDANHGIA_SUCCESSFULLY: 'UPDATE_HOATDONGDANHGIA_SUCCESSFULLY',
  DELETE_HOATDONGDANHGIA_FAILED: 'DELETE_HOATDONGDANHGIA_FAILED',
  DELETE_HOATDONGDANHGIA_SUCCESSFULLY: 'DELETE_HOATDONGDANHGIA_SUCCESSFULLY'
};

const TTL_RESET_PASSWORD = 10 * 60;

const ROLES_MESSAGE = {
  ROLES_EMPTY: 'ROLES_EMPTY',
  ROLES_ID_NOT_FOUND: 'ROLES_ID_NOT_FOUND',
  ROLES_ID_INVALID: 'ROLES_ID_INVALID',
  ROLES_EXIST: 'ROLES_EXIST',
  ROLES_FOREIGN_KEY_CONFLICT: 'ROLES_FOREIGN_KEY_CONFLICT',
  ROLES_NOT_AUTHORIZED: 'ROLES_NOT_AUTHORIZED',
  CREATE_ROLES_FAILED: 'CREATE_ROLES_FAILED',
  CREATE_ROLES_SUCCESSFULLY: 'CREATE_ROLES_SUCCESSFULLY',
  UPDATE_ROLES_FAILED: 'UPDATE_ROLES_FAILED',
  UPDATE_ROLES_SUCCESSFULLY: 'UPDATE_ROLES_SUCCESSFULLY',
  DELETE_ROLES_FAILED: 'DELETE_ROLES_FAILED',
  DELETE_ROLES_SUCCESSFULLY: 'DELETE_ROLES_SUCCESSFULLY',
  NO_PERMISTION: 'NO_PERMISTION',
  NOT_OWNER: 'NOT_OWNER',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR'
};

const REDIS_CACHE_VARS = {
  // chi tiet gom nhom
  LIST_CHI_TIET_GOM_NHOM_CACHE_COMMON_KEY: 'spms:ctgn_list',
  LIST_CHI_TIET_GOM_NHOM_CACHE_KEY: 'spms:ctgn_list:{}',
  LIST_CHI_TIET_GOM_NHOM_CACHE_TTL: 600,
  DETAIL_CHI_TIET_GOM_NHOM_CACHE_KEY: 'spms:ctgn_detail:{}',
  DETAIL_CHI_TIET_GOM_NHOM_CACHE_TTL: 600,
  LIST_CTGN_MHTT_CACHE_COMMON_KEY: 'spms:ctgn_mhtt_list',
  LIST_CTGN_MHTT_CACHE_KEY: 'spms:ctgn_mhtt_list:{}',
  LIST_CTGN_MHTT_CACHE_TTL: 600,
  LIST_CTGN_SJ_CACHE_COMMON_KEY: 'spms:ctgn_sj_list',
  LIST_CTGN_SJ_CACHE_KEY: 'spms:ctgn_sj_list:{0}-{1}-{2}',
  LIST_CTGN_SJ_CACHE_TTL: 600,
  LIST_CTGN_SJ_CTNDT_CACHE_KEY: 'spms:ctgn_sj_ctndt_list:{0}-{1}',
  LIST_CTGN_SJ_CTNDT_CACHE_TTL: 600,

  // chi tiet ke hoach
  LIST_CHI_TIET_KE_HOACH_CACHE_COMMON_KEY: 'spms:ctkh_list',
  LIST_CHI_TIET_KE_HOACH_CACHE_KEY: 'spms:ctkh_list:{}',
  LIST_CHI_TIET_KE_HOACH_CACHE_TTL: 600,
  DETAIL_CHI_TIET_KE_HOACH_CACHE_KEY: 'spms:ctkh_detail:{}',
  DETAIL_CHI_TIET_KE_HOACH_CACHE_TTL: 600,
  LIST_CTKH_SF_CACHE_COMMON_KEY: 'spms:ctkh_sf_list',
  LIST_CTKH_SF_CACHE_KEY: 'spms:ctkh_sf_list:{}',
  LIST_CTKH_SF_CACHE_TTL: 600,

  // chi tiet nganh dao tao
  LIST_CHI_TIET_NDT_CACHE_COMMON_KEY: 'spms:ctkh_list',
  LIST_CHI_TIET_NDT_CACHE_KEY: 'spms:ctkh_list:{}',
  LIST_CHI_TIET_NDT_CACHE_TTL: 600,
  DETAIL_CHI_TIET_NDT_CACHE_KEY: 'spms:ctkh_detail:{}',
  DETAIL_CHI_TIET_NDT_CACHE_TTL: 600,

  // chu de
  LIST_CHU_DE_CACHE_COMMON_KEY: 'spms:chude_list',
  LIST_CHU_DE_CACHE_KEY: 'spms:chude_list:{}',
  LIST_CHU_DE_CACHE_TTL: 600,
  DETAIL_CHU_DE_CACHE_KEY: 'spms:chude_detail:{}',
  DETAIL_CHU_DE_CACHE_TTL: 600,

  // chuan dau ra
  LIST_CDR_CACHE_COMMON_KEY: 'spms:cdr_list',
  LIST_CDR_CACHE_KEY: 'spms:cdr_list:{}',
  LIST_CDR_CACHE_TTL: 1200,
  DETAIL_CDR_CACHE_KEY: 'spms:cdr_detail:{}',
  DETAIL_CDR_CACHE_TTL: 1200,

  // chuan dau ra mon hoc
  LIST_CDRMH_CACHE_COMMON_KEY: 'spms:cdrmh_list',
  LIST_CDRMH_CACHE_KEY: 'spms:cdrmh_list:{}',
  LIST_CDRMH_CACHE_TTL: 1200,
  DETAIL_CDRMH_CACHE_KEY: 'spms:cdrmh_detail:{}',
  DETAIL_CDRMH_CACHE_TTL: 1200,

  // chuan dau ra nganh dao tao
  LIST_CDRNDT_CACHE_COMMON_KEY: 'spms:cdrndt_list',
  LIST_CDRNDT_CACHE_KEY: 'spms:cdrndt_list:{}',
  LIST_CDRNDT_CACHE_TTL: 1200,
  DETAIL_CDRNDT_CACHE_KEY: 'spms:cdrndt_detail:{}',
  DETAIL_CDRNDT_CACHE_TTL: 1200,
  LIST_CDRNDT_NDT_CACHE_COMMON_KEY: 'spms:cdrndt_ndt_list',
  LIST_CDRNDT_NDT_CACHE_KEY: 'spms:cdrndt_ndt_list:{}',
  LIST_CDRNDT_NDT_CACHE_TTL: 1200,

  // chuong trinh dao tao
  LIST_CTDT_CACHE_COMMON_KEY: 'spms:ctdt_list',
  LIST_CTDT_CACHE_KEY: 'spms:ctdt_list:{}',
  LIST_CTDT_CACHE_TTL: 6000,
  DETAIL_CTDT_CACHE_KEY: 'spms:ctdt_detail:{}',
  DETAIL_CTDT_CACHE_TTL: 6000,

  // nganh dao tao
  LIST_NDT_CACHE_COMMON_KEY: 'spms:ndt_list',
  LIST_NDT_CACHE_KEY: 'spms:ndt_list:{}',
  LIST_NDT_CACHE_TTL: 1200,
  DETAIL_NDT_CACHE_KEY: 'spms:ndt_detail:{}',
  DETAIL_NDT_CACHE_TTL: 1200,

  // gom nhom
  LIST_GOM_NHOM_CACHE_COMMON_KEY: 'spms:gn_list',
  LIST_GOM_NHOM_CACHE_KEY: 'spms:gn_list:{}',
  LIST_GOM_NHOM_CACHE_TTL: 600,
  DETAIL_GOM_NHOM_CACHE_KEY: 'spms:gn_detail:{}',
  DETAIL_GOM_NHOM_CACHE_TTL: 600,

  // he dao tao
  LIST_HE_DAO_TAO_CACHE_KEY: 'spms:hdt_list',
  LIST_HE_DAO_TAO_CACHE_TTL: 6000,
  DETAIL_HE_DAO_TAO_CACHE_KEY: 'spms:hdt_detail:{}',
  DETAIL_HE_DAO_TAO_CACHE_TTL: 6000,

  // hoat dong danh gia
  LIST_HDDG_CACHE_COMMON_KEY: 'spms:hddg_list',
  LIST_HDDG_CACHE_KEY: 'spms:hddg_list:{}',
  LIST_HDDG_CACHE_TTL: 600,
  DETAIL_HDDG_CACHE_KEY: 'spms:hddg_detail:{}',
  DETAIL_HDDG_CACHE_TTL: 600,

  // hoat dong day hoc
  LIST_HDDH_CACHE_COMMON_KEY: 'spms:hddh_list',
  LIST_HDDH_CACHE_KEY: 'spms:hddh_list:{}',
  LIST_HDDH_CACHE_TTL: 600,
  DETAIL_HDDH_CACHE_KEY: 'spms:hddh_detail:{}',
  DETAIL_HDDH_CACHE_TTL: 600,

  // ke hoach giang day
  LIST_KHGD_CACHE_COMMON_KEY: 'spms:khgd_list',
  LIST_KHGD_CACHE_KEY: 'spms:khgd_list:{}',
  LIST_KHGD_CACHE_TTL: 600,
  DETAIL_KHGD_CACHE_KEY: 'spms:khgd_detail:{}',
  DETAIL_KHGD_CACHE_TTL: 600,

  // khoi kien thuc
  LIST_KKT_CACHE_COMMON_KEY: 'spms:kkt_list',
  LIST_KKT_CACHE_KEY: 'spms:kkt_list:{}',
  LIST_KKT_CACHE_TTL: 1200,
  DETAIL_KKT_CACHE_KEY: 'spms:kkt_detail:{}',
  DETAIL_KKT_CACHE_TTL: 1200,

  // loai danh gia
  LIST_LDG_CACHE_COMMON_KEY: 'spms:ldg_list',
  LIST_LDG_CACHE_KEY: 'spms:ldg_list:{}',
  LIST_LDG_CACHE_TTL: 600,
  DETAIL_LDG_CACHE_KEY: 'spms:ldg_detail:{}',
  DETAIL_LDG_CACHE_TTL: 600,

  // loai ke hoach giang day
  LIST_LKHGD_CACHE_COMMON_KEY: 'spms:lkhgd_list',
  LIST_LKHGD_CACHE_KEY: 'spms:lkhgd_list:{}',
  LIST_LKHGD_CACHE_TTL: 600,
  DETAIL_LKHGD_CACHE_KEY: 'spms:lkhgd_detail:{}',
  DETAIL_LKHGD_CACHE_TTL: 600,

  // loai khoi kien thuc
  LIST_LKKT_CACHE_COMMON_KEY: 'spms:lkkt_list',
  LIST_LKKT_CACHE_KEY: 'spms:lkkt_list:{}',
  LIST_LKKT_CACHE_TTL: 600,
  DETAIL_LKKT_CACHE_KEY: 'spms:lkkt_detail:{}',
  DETAIL_LKKT_CACHE_TTL: 600,

  // mon hoc
  LIST_MON_HOC_CACHE_COMMON_KEY: 'spms:monhoc_list',
  LIST_MON_HOC_CACHE_KEY: 'spms:monhoc_list:{}',
  LIST_MON_HOC_CACHE_TTL: 600,
  DETAIL_MON_HOC_CACHE_KEY: 'spms:monhoc_detail:{}',
  DETAIL_MON_HOC_CACHE_TTL: 600,
  LIST_MH_NDT_KT_CACHE_COMMON_KEY: 'spms:mh_ndt_kt_list',
  LIST_MH_NDT_KT_CACHE_KEY: 'spms:mh_ndt_kt_list:{0}-{1}',
  LIST_MH_NDT_KT_CACHE_TTL: 600,

  // mon hoc tien quyet
  LIST_MHTQ_CACHE_COMMON_KEY: 'spms:mhtq_list',
  LIST_MHTQ_CACHE_KEY: 'spms:mhtq_list:{}',
  LIST_MHTQ_CACHE_TTL: 600,
  DETAIL_MHTQ_CACHE_KEY: 'spms:mhtq_detail:{}',
  DETAIL_MHTQ_CACHE_TTL: 600,
  LIST_MHTQ_MHT_CACHE_COMMON_KEY: 'spms:mhtq_mht_list',
  LIST_MHTQ_MHT_CACHE_KEY: 'spms:mhtq_mht_list:{0}-{1}',
  LIST_MHTQ_MHT_CACHE_TTL: 600,

  // muc tieu mon hoc
  LIST_MTMH_CACHE_COMMON_KEY: 'spms:mtmh_list',
  LIST_MTMH_CACHE_KEY: 'spms:mtmh_list:{}',
  LIST_MTMH_CACHE_TTL: 3000,
  DETAIL_MTMH_CACHE_KEY: 'spms:mtmh_detail:{}',
  DETAIL_MTMH_CACHE_TTL: 3000,

  // nam hoc
  LIST_NAM_HOC_CACHE_KEY: 'spms:namhoc_list',
  LIST_NAM_HOC_CACHE_TTL: 6000,
  DETAIL_NAM_HOC_CACHE_KEY: 'spms:namhoc_detail:{}',
  DETAIL_NAM_HOC_CACHE_TTL: 6000,

  // role
  LIST_ROLE_CACHE_COMMON_KEY: 'spms:role_list',
  LIST_ROLE_CACHE_KEY: 'spms:role_list:{}',
  LIST_ROLE_CACHE_TTL: 6000,
  DETAIL_ROLE_CACHE_KEY: 'spms:role_detail:{}',
  DETAIL_ROLE_CACHE_TTL: 6000,

  // so khop
  LIST_SO_KHOP_CACHE_COMMON_KEY: 'spms:so_khop_list',
  LIST_SO_KHOP_CACHE_KEY: 'spms:so_khop_list:{0}-{1}',
  LIST_SO_KHOP_CACHE_TTL: 6000,

  // syllabus
  LIST_SYLLABUS_CACHE_COMMON_KEY: 'spms:syllabus_list',
  LIST_SYLLABUS_CACHE_KEY: 'spms:syllabus_list:{}',
  LIST_SYLLABUS_CACHE_TTL: 600,
  DETAIL_SYLLABUS_CACHE_KEY: 'spms:syllabus_detail:{}',
  DETAIL_SYLLABUS_CACHE_TTL: 600,

  // thong ke
  THONG_KE_GV_CACHE_COMMON_KEY: 'spms:thong_ke_gv',
  THONG_KE_GV_CACHE_KEY: 'spms:thong_ke_gv:{}',
  THONG_KE_GV_CACHE_TTL: 600,
  THONG_KE_INTRO_CACHE_KEY: 'spms:thong_ke_intro',
  THONG_KE_INTRO_CACHE_TTL: 600,
  THONG_KE_SLCDR_CACHE_COMMON_KEY: 'spms:thong_ke_slcdr',
  THONG_KE_SLCDR_CACHE_KEY: 'spms:thong_ke_slcdr:{}',
  THONG_KE_SLCDR_CACHE_TTL: 600,

  // user
  LIST_USER_CACHE_COMMON_KEY: 'spms:user_list',
  LIST_USER_CACHE_KEY: 'spms:user_list:{}',
  LIST_USER_CACHE_TTL: 600,
  DETAIL_USER_CACHE_KEY: 'spms:user_detail:{}',
  DETAIL_USER_CACHE_TTL: 1200,
  PROFILE_USER_CACHE_KEY: 'spms:profile_user:{}',
  PROFILE_USER_CACHE_TTL: 1200
};
const SOKHOP_MESSAGE = {
  UPDATE_MONHOCTRUOC_SUCCESSFULLY: 'UPDATE_MONHOCTRUOC_SUCCESSFULLY',
  CHITIETGOMNHOM_NOT_IN: 'CHITIETGOMNHOM_NOT_IN',
  CHITIETGOMNHOM_MONHOCTRUOC_NOT_IN: 'CHITIETGOMNHOM_MONHOCTRUOC_NOT_IN',
  UPDATE_MONHOCTRUOC_FAILED: 'UPDATE_MONHOCTRUOC_FAILED'
};
const CLONE_MESSAGE = {
  CREATE_NOI_DUNG_SUCCESSFULLY: 'CREATE_NOI_DUNG_SUCCESSFULLY',
  CREATE_NOI_DUNG_FAILED: 'CREATE_NOI_DUNG_FAILED',
  CREATE_KE_HOACH_GIANG_DAY_SUCCESSFULLY: 'CREATE_KE_HOACH_GIANG_DAY_SUCCESSFULLY',
  CREATE_KE_HOACH_GIANG_DAY_FAILED: 'CREATE_KE_HOACH_GIANG_DAY_FAILED',
  MON_HOC_EMPTY: 'MON_HOC_EMPTY',
  KE_HOACH_GIANG_DAY_EXISTED: 'KE_HOACH_GIANG_DAY_EXISTED',
  CREATE_CHUAN_DAU_RA_SUCCESSFULLY: 'CREATE_CHUAN_DAU_RA_SUCCESSFULLY',
  CREATE_CHUAN_DAU_RA_FAILED: 'CREATE_CHUAN_DAU_RA_FAILED',
  CHUAN_DAU_RA_EXITSTED: 'CHUAN_DAU_RA_EXITSTED',
  CREATE_CHUONG_TRINH_DAO_TAO_SUCCESSFULLY: 'CREATE_CHUONG_TRINH_DAO_TAO_SUCCESSFULLY',
  CHUAN_DAU_RA_NOT_EMPTY: 'CHUAN_DAU_RA_NOT_EMPTY',
  KHOI_KIEN_THUC_NOT_EMPTY: 'KHOI_KIEN_THUC_NOT_EMPTY',
  KE_HOACH_GIANG_DAY_NOT_EMPTY: 'KE_HOACH_GIANG_DAY_NOT_EMPTY',
  MON_HOC_NOT_EXIST_IN_KHOI_KIEN_THUC: 'MON_HOC_NOT_EXIST_IN_KHOI_KIEN_THUC',
  CONTENT_EXISTED: 'CONTENT_EXISTED'
};

const GENERATE_SYLLABUS_MESSAGE = {
  GENERATE_SYLLABUS_NOT_AUTHORIZED: 'GENERATE_SYLLABUS_AUTHORIZED',
  GENERATE_SYLLABUS_FAILED: 'GENERATE_SYLLABUS_FAILED',
  GENERATE_SYLLABUS_SUCCESSFULLY: 'GENERATE_SYLLABUS_SUCCESSFULLY'
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
  LOAIDANHGIA_MESSAGE,
  MAIL_OPTIONS,
  ROLE_SINHVIEN,
  CONFIRM_SIGNUP_PATH,
  MUCTIEUMONHOC_MESSAGE,
  RESPONSE_MESSAGE,
  CHITIETKEHOACH_MESSAGE,
  MONHOC_MESSAGE,
  CHITIETGOMNHOM_MESSAGE,
  CHUDE_MESSAGE,
  GOMNHOM_MESSAGE,
  HOATDONGDAYHOC_MESSAGE,
  LOAIKEHOACHGIANGDAY_MESSAGE,
  SYLLABUS_MESSAGE,
  NAMHOC_MESSAGE,
  HEDAOTAO_MESSAGE,
  KHOIKIENTHUC_MESSAGE,
  LOAIKHOIKIENTHUC_MESSAGE,
  MONHOCTIENQUYET_MESSAGE,
  CHUANDAURAMONHOC_MESSAGE,
  HOATDONGDANHGIA_MESSAGE,
  TTL_RESET_PASSWORD,
  ROLES_MESSAGE,
  REDIS_CACHE_VARS,
  SOKHOP_MESSAGE,
  CLONE_MESSAGE,
  GENERATE_SYLLABUS_MESSAGE
};
