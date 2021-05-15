use `qHtJYlp09Y`;
SET SQL_SAFE_UPDATES = 0;
# Chuan dau ra mon hoc ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_chuan_dau_ra_mon_hoc;
delimiter $$ CREATE TRIGGER trigger_insert_chuan_dau_ra_mon_hoc before
insert on ChuanDauRaMonHoc for each row begin call procedure_check_cdrmh_before_insert_or_update(new.idMTMH, new.ma);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_chuan_dau_ra_mon_hoc;
delimiter $$ CREATE TRIGGER trigger_update_chuan_dau_ra_mon_hoc before
update on ChuanDauRaMonHoc for each row begin if new.isDeleted = false then call procedure_check_cdrmh_before_insert_or_update(new.idMTMH, new.ma);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_cdrmh_before_insert_or_update;
delimiter $$ create procedure procedure_check_cdrmh_before_insert_or_update(in newIDMTMH int, in newMa varchar(200)) begin if (
        select exists (
                        select *
                        from ChuanDauRaMonHoc as cdrmh
                        where cdrmh.idMTMH = newIDMTMH
                                and cdrmh.ma = newMa
                                and cdrmh.isDeleted = false
                )
) then signal sqlstate '45000'
set message_text = 'Set of values "IdMTMH, ma" is exist.';
end if;
end $$ delimiter;
# Muc tieu mon hoc ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_muc_tieu_mon_hoc;
delimiter $$ CREATE TRIGGER trigger_insert_muc_tieu_mon_hoc before
insert on MucTieuMonHoc for each row begin call procedure_check_mtmh_before_insert_or_update(new.idSyllabus, new.ma);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_muc_tieu_mon_hoc;
delimiter $$ CREATE TRIGGER trigger_update_muc_tieu_mon_hoc before
update on MucTieuMonHoc for each row begin if new.isDeleted = false then call procedure_check_mtmh_before_insert_or_update(new.idSyllabus, new.ma);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_mtmh_before_insert_or_update;
delimiter $$ create procedure procedure_check_mtmh_before_insert_or_update(in newIDSyllabus int, in newMa varchar(200)) begin if (
        select exists (
                        select *
                        from MucTieuMonHoc as mtmh
                        where mtmh.idSyllabus = newIDSyllabus
                                and mtmh.ma = newMa
                                and mtmh.isDeleted = false
                )
) then signal sqlstate '45000'
set message_text = 'Set of values "IdSyllabus, ma" is exist.';
end if;
end $$ delimiter;
# Loai danh gia ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_loai_danh_gia;
delimiter $$ CREATE TRIGGER trigger_insert_loai_danh_gia before
insert on LoaiDanhGia for each row begin call procedure_check_ldg_before_insert_or_update(new.idSyllabus, new.ma);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_loai_danh_gia;
delimiter $$ CREATE TRIGGER trigger_update_loai_danh_gia before
update on LoaiDanhGia for each row begin if new.isDeleted = false then call procedure_check_ldg_before_insert_or_update(new.idSyllabus, new.ma);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_ldg_before_insert_or_update;
delimiter $$ create procedure procedure_check_ldg_before_insert_or_update(in newIDSyllabus int, in newMa varchar(200)) begin if (
        select exists (
                        select *
                        from LoaiDanhGia as ldg
                        where ldg.idSyllabus = newIDSyllabus
                                and ldg.ma = newMa
                                and ldg.isDeleted = false
                )
) then signal sqlstate '45000'
set message_text = 'Set of values "IdSyllabus, ma" is exist.';
end if;
end $$ delimiter;
# Hoat dong danh gia ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_hoat_dong_danh_gia;
delimiter $$ CREATE TRIGGER trigger_insert_hoat_dong_danh_gia before
insert on HoatDongDanhGia for each row begin call procedure_check_hddg_before_insert_or_update(new.idLDG, new.ma);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_hoat_dong_danh_gia;
delimiter $$ CREATE TRIGGER trigger_update_hoat_dong_danh_gia before
update on HoatDongDanhGia for each row begin if new.isDeleted = false then call procedure_check_hddg_before_insert_or_update(new.idLDG, new.ma);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_hddg_before_insert_or_update;
delimiter $$ create procedure procedure_check_hddg_before_insert_or_update(in newIDLDG int, in newMa varchar(200)) begin if (
        select exists (
                        select *
                        from HoatDongDanhGia as hddg
                        where hddg.idLDG = newIDLDG
                                and hddg.ma = newMa
                                and hddg.isDeleted = false
                )
) then signal sqlstate '45000'
set message_text = 'Set of values "IdLDG, ma" is exists.';
end if;
end $$ delimiter;
# Chu de ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_chu_de;
delimiter $$ CREATE TRIGGER trigger_insert_chu_de before
insert on ChuDe for each row begin call procedure_check_cd_before_insert_or_update(new.idSyllabus, new.idLKHGD, new.ma);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_chu_de;
delimiter $$ CREATE TRIGGER trigger_update_chu_de before
update on ChuDe for each row begin if new.isDeleted = false then call procedure_check_cd_before_insert_or_update(new.idSyllabus, new.idLKHGD, new.ma);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_cd_before_insert_or_update;
delimiter $$ create procedure procedure_check_cd_before_insert_or_update(
        in newIDSyllabus int,
        in newIDLKHGD int,
        in newMa varchar(200)
) begin if (
        select exists (
                        select *
                        from ChuDe as cd
                        where cd.idSyllabus = newIDSyllabus
                                and cd.ma = newMa
                                and cd.isDeleted = false
                                and cd.idLKHGD = newIDLKHGD
                )
) then signal sqlstate '45000'
set message_text = 'Set of values "IdSyllabus, idLKHGD, ma" is exists.';
end if;
end $$ delimiter;
# Chuong trinh dao tao ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_chuong_trinh_dao_tao;
delimiter $$ CREATE TRIGGER trigger_insert_chuong_trinh_dao_tao before
insert on ChuongTrinhDaoTao for each row begin call procedure_check_ctdt_before_insert_or_update(new.MaCTDT);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_chuong_trinh_dao_tao;
delimiter $$ CREATE TRIGGER trigger_update_chuong_trinh_dao_tao before
update on ChuongTrinhDaoTao for each row begin if new.isDeleted = false then call procedure_check_ctdt_before_insert_or_update(new.MaCTDT);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_ctdt_before_insert_or_update;
delimiter $$ create procedure procedure_check_ctdt_before_insert_or_update(in newMa varchar(200)) begin if (
        select exists (
                        select *
                        from ChuongTrinhDaoTao as ctdt
                        where ctdt.MaCTDT = newMa
                                and ctdt.isDeleted = false
                )
) then signal sqlstate '45000'
set message_text = 'MaCTDT is exists.';
end if;
end $$ delimiter;
# Nganh dao tao ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_nganh_dao_tao;
delimiter $$ CREATE TRIGGER trigger_insert_nganh_dao_tao before
insert on NganhDaoTao for each row begin call procedure_check_ndt_before_insert_or_update(new.MaNganhDaoTao, new.ctdtID);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_nganh_dao_tao;
delimiter $$ CREATE TRIGGER trigger_update_nganh_dao_tao before
update on NganhDaoTao for each row begin if new.isDeleted = false then call procedure_check_ndt_before_insert_or_update(new.MaNganhDaoTao, new.ctdtID);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_ndt_before_insert_or_update;
delimiter $$ create procedure procedure_check_ndt_before_insert_or_update(in newMa varchar(200), in newCTDTId int) begin if (
        select exists (
                        select *
                        from NganhDaoTao as ndt
                        where ndt.MaNganhDaoTao = newMa
                                and ndt.isDeleted = false
                                and ndt.ctdtId = newCTDTId
                )
) then signal sqlstate '45000'
set message_text = 'Set of value "MaNganhDaoTao, ctdtId" is exists.';
end if;
end $$ delimiter;
# Khoi kien thuc ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_khoi_kien_thuc;
delimiter $$ CREATE TRIGGER trigger_insert_khoi_kien_thuc before
insert on KhoiKienThuc for each row begin call procedure_check_kkt_before_insert_or_update(new.MaKTT, new.ID_ChiTietNganhDaoTao);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_khoi_kien_thuc;
delimiter $$ CREATE TRIGGER trigger_update_khoi_kien_thuc before
update on KhoiKienThuc for each row begin if new.isDeleted = false then call procedure_check_kkt_before_insert_or_update(new.MaKTT, new.ID_ChiTietNganhDaoTao);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_kkt_before_insert_or_update;
delimiter $$ create procedure procedure_check_kkt_before_insert_or_update(in newMa varchar(200), in newIDCTNDT int) begin if (
        select exists (
                        select *
                        from KhoiKienThuc as alias
                        where alias.MaKTT = newMa
                                and alias.isDeleted = false
                                and alias.ID_ChiTietNganhDaoTao = newIDCTNDT
                )
) then signal sqlstate '45000'
set message_text = 'Set of value "MaKKT, ID_ChiTietNganhDaoTao" is exists.';
end if;
end $$ delimiter;
# Ke hoach giang day ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_ke_hoach_giang_day;
delimiter $$ CREATE TRIGGER trigger_insert_ke_hoach_giang_day before
insert on KeHoachGiangDay for each row begin call procedure_check_khgd_before_insert_or_update(new.MaKeHoach, new.ID_ChiTietNganhDaoTao);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_ke_hoach_giang_day;
delimiter $$ CREATE TRIGGER trigger_update_ke_hoach_giang_day before
update on KeHoachGiangDay for each row begin if new.isDeleted = false then call procedure_check_khgd_before_insert_or_update(new.MaKeHoach, new.ID_ChiTietNganhDaoTao);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_khgd_before_insert_or_update;
delimiter $$ create procedure procedure_check_khgd_before_insert_or_update(in newMa varchar(200), in newIDCTNDT int) begin if (
        select exists (
                        select *
                        from KeHoachGiangDay as alias
                        where alias.MaKTT = newMa
                                and alias.isDeleted = false
                                and alias.ID_ChiTietNganhDaoTao = newIDCTNDT
                )
) then signal sqlstate '45000'
set message_text = 'Set of value "MaKeHoach, ID_ChiTietNganhDaoTao" is exists.';
end if;
end $$ delimiter;
# Loai khoi kien thuc ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_loai_khoi_kien_thuc;
delimiter $$ CREATE TRIGGER trigger_insert_loai_khoi_kien_thuc before
insert on LoaiKhoiKienThuc for each row begin call procedure_check_lkkt_before_insert_or_update(new.Ma_LoaiKhoiKT, new.ID_KhoiKienThuc);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_loai_khoi_kien_thuc;
delimiter $$ CREATE TRIGGER trigger_update_loai_khoi_kien_thuc before
update on LoaiKhoiKienThuc for each row begin if new.isDeleted = false then call procedure_check_lkkt_before_insert_or_update(new.Ma_LoaiKhoiKT, new.ID_KhoiKienThuc);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_lkkt_before_insert_or_update;
delimiter $$ create procedure procedure_check_lkkt_before_insert_or_update(in newMa varchar(200), in newIDKKT int) begin if (
        select exists (
                        select *
                        from LoaiKhoiKienThuc as alias
                        where alias.Ma_LoaiKhoiKT = newMa
                                and alias.isDeleted = false
                                and alias.ID_KhoiKienThuc = newIDKKT
                )
) then signal sqlstate '45000'
set message_text = 'Set of value "Ma_LoaiKhoiKT, ID_KhoiKienThuc" is exists.';
end if;
end $$ delimiter;
# Gom nhom ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_gom_nhom;
delimiter $$ CREATE TRIGGER trigger_insert_gom_nhom before
insert on GomNhom for each row begin call procedure_check_gn_before_insert_or_update(new.Ma_GomNhom, new.ID_LoaiKhoiKienThuc);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_gom_nhom;
delimiter $$ CREATE TRIGGER trigger_update_gom_nhom before
update on GomNhom for each row begin if new.isDeleted = false then call procedure_check_gn_before_insert_or_update(new.Ma_GomNhom, new.ID_LoaiKhoiKienThuc);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_gn_before_insert_or_update;
delimiter $$ create procedure procedure_check_gn_before_insert_or_update(in newMa varchar(200), in newIDLKKT int) begin if (
        select exists (
                        select *
                        from GomNhom as alias
                        where alias.Ma_GomNhom = newMa
                                and alias.isDeleted = false
                                and alias.ID_LoaiKhoiKienThuc = newIDLKKT
                )
) then signal sqlstate '45000'
set message_text = 'Set of value "Ma_GomNhom, ID_LoaiKhoiKienThuc" is exists.';
end if;
end $$ delimiter;
# Mon hoc ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_mon_hoc;
delimiter $$ CREATE TRIGGER trigger_insert_mon_hoc before
insert on MonHoc for each row begin call procedure_check_mh_before_insert_or_update(new.ma);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_mon_hoc;
delimiter $$ CREATE TRIGGER trigger_update_mon_hoc before
update on MonHoc for each row begin if new.isDeleted = false then call procedure_check_mh_before_insert_or_update(new.ma);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_mh_before_insert_or_update;
delimiter $$ create procedure procedure_check_mh_before_insert_or_update(in newMa varchar(200)) begin if (
        select exists (
                        select *
                        from MonHoc as alias
                        where alias.ma = newMa
                                and alias.isDeleted = false
                )
) then signal sqlstate '45000'
set message_text = 'Set of value "ma" is exists.';
end if;
end $$ delimiter;
# Nam hoc ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_nam_hoc;
delimiter $$ CREATE TRIGGER trigger_insert_nam_hoc before
insert on NamHoc for each row begin call procedure_check_nh_before_insert_or_update(new.ma);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_nam_hoc;
delimiter $$ CREATE TRIGGER trigger_update_nam_hoc before
update on NamHoc for each row begin if new.isDeleted = false then call procedure_check_nh_before_insert_or_update(new.ma);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_nh_before_insert_or_update;
delimiter $$ create procedure procedure_check_nh_before_insert_or_update(in newMa varchar(200)) begin if (
        select exists (
                        select *
                        from NamHoc as alias
                        where alias.ma = newMa
                                and alias.isDeleted = false
                )
) then signal sqlstate '45000'
set message_text = 'Set of value "ma" is exists.';
end if;
end $$ delimiter;
# He dao tao ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_he_dao_tao;
delimiter $$ CREATE TRIGGER trigger_insert_he_dao_tao before
insert on HeDaoTao for each row begin call procedure_check_hdt_before_insert_or_update(new.ma);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_he_dao_tao;
delimiter $$ CREATE TRIGGER trigger_update_he_dao_tao before
update on HeDaoTao for each row begin if new.isDeleted = false then call procedure_check_hdt_before_insert_or_update(new.ma);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_hdt_before_insert_or_update;
delimiter $$ create procedure procedure_check_hdt_before_insert_or_update(in newMa varchar(200)) begin if (
        select exists (
                        select *
                        from HeDaoTao as alias
                        where alias.ma = newMa
                                and alias.isDeleted = false
                )
) then signal sqlstate '45000'
set message_text = 'Set of value "ma" is exists.';
end if;
end $$ delimiter;
# Hoat dong day hoc ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_hoat_dong_day_hoc;
delimiter $$ CREATE TRIGGER trigger_insert_hoat_dong_day_hoc before
insert on HoatDongDayHoc for each row begin call procedure_check_hddh_before_insert_or_update(new.ma);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_hoat_dong_day_hoc;
delimiter $$ CREATE TRIGGER trigger_update_hoat_dong_day_hoc before
update on HoatDongDayHoc for each row begin if new.isDeleted = false then call procedure_check_hddh_before_insert_or_update(new.ma);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_hddh_before_insert_or_update;
delimiter $$ create procedure procedure_check_hddh_before_insert_or_update(in newMa varchar(200)) begin if (
        select exists (
                        select *
                        from HoatDongDayHoc as alias
                        where alias.ma = newMa
                                and alias.isDeleted = false
                )
) then signal sqlstate '45000'
set message_text = 'Set of value "ma" is exists.';
end if;
end $$ delimiter;
# Loai ke hoach giang day ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_loai_ke_hoach_giang_day;
delimiter $$ CREATE TRIGGER trigger_insert_loai_ke_hoach_giang_day before
insert on LoaiKeHoachGiangDay for each row begin call procedure_check_lkhgd_before_insert_or_update(new.ma);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_loai_ke_hoach_giang_day;
delimiter $$ CREATE TRIGGER trigger_update_loai_ke_hoach_giang_day before
update on LoaiKeHoachGiangDay for each row begin if new.isDeleted = false then call procedure_check_lkhgd_before_insert_or_update(new.ma);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_lkhgd_before_insert_or_update;
delimiter $$ create procedure procedure_check_lkhgd_before_insert_or_update(in newMa varchar(200)) begin if (
        select exists (
                        select *
                        from LoaiKeHoachGiangDay as alias
                        where alias.ma = newMa
                                and alias.isDeleted = false
                )
) then signal sqlstate '45000'
set message_text = 'Set of value "ma" is exists.';
end if;
end $$ delimiter;
# Chi tiet ke hoach  ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_chi_tiet_ke_hoach;
delimiter $$ CREATE TRIGGER trigger_insert_chi_tiet_ke_hoach before
insert on ChiTietKeHoach for each row begin call procedure_check_ctkh_before_insert_or_update(new.ID_KeHoachGiangDay, new.ID_ChiTietGomNhom);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_chi_tiet_ke_hoach;
delimiter $$ CREATE TRIGGER trigger_update_chi_tiet_ke_hoach before
update on ChiTietKeHoach for each row begin if new.isDeleted = false then call procedure_check_ctkh_before_insert_or_update(new.ID_KeHoachGiangDay, new.ID_ChiTietGomNhom);
end if;
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_ctkh_before_insert_or_update;
delimiter $$ create procedure procedure_check_ctkh_before_insert_or_update(in newIDKHGD int, in newIDCTGN int) begin if (
        select not exists (
                        select *
                        from ChiTietGomNhom alias
                        where alias.isDeleted = false
                                and alias.ID = newIDCTGN
                                and alias.ID in (
                                        select ctgn.ID
                                        from KeHoachGiangDay khgd
                                                left join KhoiKienThuc kkt on kkt.ID_ChiTietNganhDaoTao = khgd.ID_ChiTietNganhDaoTao
                                                left join LoaiKhoiKienThuc lkkt on lkkt.ID_KhoiKienThuc = kkt.ID
                                                left join GomNhom gn on gn.ID_LoaiKhoiKienThuc = lkkt.ID
                                                left join ChiTietGomNhom ctgn on ctgn.ID_GomNhom = gn.ID
                                        where khgd.ID = newIDKHGD
                                                and khgd.isDeleted = false
                                                and kkt.isDeleted = false
                                                and lkkt.isDeleted = false
                                                and gn.isDeleted = false
                                                and ctgn.isDeleted = false
                                )
                )
) then signal sqlstate '45000'
set message_text = 'ID_ChiTietGomNhom must belong to ChiTietGomNhom with the same ID_ChiTetNganhDaoTao';
end if;
end $$ delimiter;
# Chu de Hoat Dong Danh Gia  ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_chu_de_hoat_dong_danh_gia;
delimiter $$ CREATE TRIGGER trigger_insert_chu_de_hoat_dong_danh_gia before
insert on ChuDe_HoatDongDanhGia for each row begin call procedure_check_cd_hddg_before_insert_or_update(new.idChuDe, new.idHoatDongDanhGia);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_chu_de_hoat_dong_danh_gia;
delimiter $$ CREATE TRIGGER trigger_update_chu_de_hoat_dong_danh_gia before
update on ChuDe_HoatDongDanhGia for each row begin call procedure_check_cd_hddg_before_insert_or_update(new.idChuDe, new.idHoatDongDanhGia);
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_cd_hddg_before_insert_or_update;
delimiter $$ create procedure procedure_check_cd_hddg_before_insert_or_update(in newIdChuDe int, in newIdHDDG int) begin if (
        select not exists (
                        select *
                        from HoatDongDanhGia alias
                        where alias.isDeleted = false
                                and alias.id = newIdHDDG
                                and alias.id in (
                                        select hddg.id
                                        from ChuDe cd
                                                left join LoaiDanhGia ldg on ldg.idSyllabus = cd.idSyllabus
                                                left join HoatDongDanhGia hddg on hddg.idLDG = ldg.id
                                        where cd.id = newIdChuDe
                                                and hddg.isDeleted = false
                                                and ldg.isDeleted = false
                                                and cd.isDeleted = false
                                )
                )
) then signal sqlstate '45000'
set message_text = 'idHoatDongDanhGia must belong to HoatDongDanhGia with the same idSyllabus';
end if;
end $$ delimiter;
# Chu de Chuan dau ra mon hoc  ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_chu_de_chuan_dau_ra_mon_hoc;
delimiter $$ CREATE TRIGGER trigger_insert_chu_de_hoat_chuan_dau_ra_mon_hoc before
insert on ChuDe_ChuanDauRaMonHoc for each row begin call procedure_check_cd_cdrmh_before_insert_or_update(new.idCD, new.idCDRMH);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_chu_de_chuan_dau_ra_mon_hoc;
delimiter $$ CREATE TRIGGER trigger_update_chu_de_chuan_dau_ra_mon_hoc before
update on ChuDe_ChuanDauRaMonHoc for each row begin call procedure_check_cd_cdrmh_before_insert_or_update(new.idCD, new.idCDRMH);
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_cd_cdrmh_before_insert_or_update;
delimiter $$ create procedure procedure_check_cd_cdrmh_before_insert_or_update(in newIdChuDe int, in newIdCDRMH int) begin if (
        select not exists (
                        select *
                        from ChuanDauRaMonHoc alias
                        where alias.isDeleted = false
                                and alias.ID = newIdCDRMH
                                and alias.ID in (
                                        select cdrmh.id
                                        from ChuDe cd
                                                left join MucTieuMonHoc mtmh on mtmh.idSyllabus = cd.idSyllabus
                                                left join ChuanDauRaMonHoc cdrmh on cdrmh.idMTMH = mtmh.id
                                        where cd.id = newIdChuDe
                                                and cd.isDeleted = false
                                                and mtmh.isDeleted = false
                                                and cdrmh.isDeleted = false
                                )
                )
) then signal sqlstate '45000'
set message_text = 'idChuanDauRaMonHoc must belong to ChuanDauRaMonHoc with the same idSyllabus';
end if;
end $$ delimiter;
# HoatDongDanhGia ChuanDauRaMonHoc  ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_hddg_cdrmh;
delimiter $$ CREATE TRIGGER trigger_insert_hddg_cdrmh before
insert on HoatDongDanhGia_ChuanDauRaMonHoc for each row begin call procedure_check_hddg_cdrmh_before_insert_or_update(new.idHDDG, new.idCDRMH);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_hddg_cdrmh;
delimiter $$ CREATE TRIGGER trigger_update_hddg_cdrmh before
update on HoatDongDanhGia_ChuanDauRaMonHoc for each row begin call procedure_check_hddg_cdrmh_before_insert_or_update(new.idHDDG, new.idCDRMH);
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_hddg_cdrmh_before_insert_or_update;
delimiter $$ create procedure procedure_check_hddg_cdrmh_before_insert_or_update(in newIdHDDG int, in newIdCDRMH int) begin if (
        select not exists (
                        select *
                        from ChuanDauRaMonHoc alias
                        where alias.isDeleted = false
                                and alias.id = newIdCDRMH
                                and alias.id in (
                                        select cdrmh.id
                                        from HoatDongDanhGia hddg
                                                left join LoaiDanhGia ldg on ldg.id = hddg.idLDG
                                                left join MucTieuMonHoc mtmh on mtmh.idSyllabus = ldg.idSyllabus
                                                left join ChuanDauRaMonHoc cdrmh on cdrmh.idMTMH = mtmh.id
                                        where hddg.id = newIdHDDG
                                                and hddg.isDeleted = false
                                                and ldg.isDeleted = false
                                                and mtmh.isDeleted = false
                                                and cdrmh.isDeleted = false
                                )
                )
) then signal sqlstate '45000'
set message_text = 'idCDRMH must belong to ChuanDauRaMonHoc with the same ID_ChiTetNganhDaoTao';
end if;
end $$ delimiter;
# LoaiDanhGia ChuanDauRaMonHoc  ------------------------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_ldg_cdrmh;
delimiter $$ CREATE TRIGGER trigger_insert_ldg_cdrmh before
insert on LoaiDanhGia_ChuanDauRaMonHoc for each row begin call procedure_check_ldg_cdrmh_before_insert_or_update(new.idLoaiDanhGia, new.idChuanDauRaMonHoc);
end $$ delimiter;
DROP TRIGGER IF EXISTS trigger_update_ldg_cdrmh;
delimiter $$ CREATE TRIGGER trigger_update_ldg_cdrmh before
update on LoaiDanhGia_ChuanDauRaMonHoc for each row begin call procedure_check_ldg_cdrmh_before_insert_or_update(new.idLoaiDanhGia, new.idChuanDauRaMonHoc);
end $$ delimiter;
DROP procedure IF EXISTS procedure_check_ldg_cdrmh_before_insert_or_update;
delimiter $$ create procedure procedure_check_ldg_cdrmh_before_insert_or_update(in newIdLDG int, in newIdCDRMH int) begin if (
        select not exists (
                        select *
                        from ChuanDauRaMonHoc alias
                        where alias.isDeleted = false
                                and alias.id = newIdCDRMH
                                and alias.id in (
                                        select cdrmh.id
                                        from LoaiDanhGia ldg
                                                left join MucTieuMonHoc mtmh on mtmh.idSyllabus = ldg.idSyllabus
                                                left join ChuanDauRaMonHoc cdrmh on cdrmh.idMTMH = mtmh.id
                                        where ldg.id = newIdLDG
                                                and ldg.isDeleted = false
                                                and mtmh.isDeleted = false
                                                and cdrmh.isDeleted = false
                                )
                )
) then signal sqlstate '45000'
set message_text = 'idChuanDauRaMonHoc must belong to ChuanDauRaMonHoc with the same ID_ChiTetNganhDaoTao';
end if;
end $$ delimiter;