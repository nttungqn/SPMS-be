use `qHtJYlp09Y`;
SET GLOBAL event_scheduler = ON;
SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;

drop event if exists schedule_delete_rows_have_been_isDeleted;
delimiter $$
create event schedule_delete_rows_have_been_isDeleted on schedule every 1 month starts current_timestamp()
do 
	begin
		delete from ChiTietGomNhom where isDeleted = 1;
		delete from ChiTietKeHoach where isDeleted = 1;
		delete from ChiTietNganhDaoTao where isDeleted = 1;
		delete from ChuanDauRa where isDeleted = 1;
		delete from ChuanDauRaMonHoc where isDeleted = 1;
		delete from ChuanDauRaNganhDauTao where isDeleted = 1;
		delete from ChuDe where isDeleted = 1;
		delete from ChuongTrinhDaoTao where isDeleted = 1;
		delete from GomNhom where isDeleted = 1;
		delete from HeDaoTao where isDeleted = 1;
		delete from HoatDongDanhGia where isDeleted = 1;
		delete from HoatDongDayHoc where isDeleted = 1;
		delete from KeHoachGiangDay where isDeleted = 1;
		delete from KhoiKienThuc where isDeleted = 1;
		delete from LoaiDanhGia where isDeleted = 1;
		delete from LoaiKeHoachGiangDay where isDeleted = 1;
		delete from MonHoc where isDeleted = 1;
		delete from MonHoc_MonHocTienQuyet where isDeleted = 1;
		delete from MucTieuMonHoc where isDeleted = 1;
		delete from NamHoc where isDeleted = 1;
		delete from NganhDaoTao where isDeleted = 1;
		delete from roles where isDeleted = 1;
		delete from Syllabus where isDeleted = 1;
		delete from users where isDeleted = 1;
	end
$$
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
    
    