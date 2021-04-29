use `qHtJYlp09Y`;
SET SQL_SAFE_UPDATES = 0;

# -------------------------------------------
DROP TRIGGER IF EXISTS update_tcbb_gn_by_mh;
delimiter $$
CREATE TRIGGER update_tcbb_gn_by_mh after update on MonHoc for each row
begin
	if old.SoTinChi <> new.SoTinChi then
		update GomNhom gn
		inner join (
			select ctgn.ID_GomNhom, COALESCE(sum(mh.soTinChi),0) as TongTC_GN 
			from ChiTietGomNhom ctgn
			left join MonHoc mh ON mh.id = ctgn.ID_MonHoc
			left join GomNhom gn on gn.ID = ctgn.ID_GomNhom
            where mh.isDeleted = false and gn.isDeleted = false
			group by ctgn.ID_GomNhom
            having ctgn.isDeleted = false) nt1 
		on gn.ID = nt1.ID_GomNhom
		set gn.SoTCBB = nt1.TongTC_GN
        where gn.LoaiNhom = "BB" and gn.isDeleted = false;
	end if;
end
$$
delimiter ;

# -------------------------------------------
DROP TRIGGER IF EXISTS trigger_update_ctgn;
delimiter $$
CREATE TRIGGER trigger_update_ctgn after update on ChiTietGomNhom for each row
begin
	call procedure_update_tcbb_gn_by_ctgn(new.ID_GomNhom);
end
$$
delimiter ;

DROP TRIGGER IF EXISTS trigger_insert_ctgn;
delimiter $$
CREATE TRIGGER trigger_insert_ctgn after insert on ChiTietGomNhom for each row
begin
	call procedure_update_tcbb_gn_by_ctgn(new.ID_GomNhom);
end
$$
delimiter ;

DROP procedure IF EXISTS procedure_update_tcbb_gn_by_ctgn;
delimiter $$
create procedure procedure_update_tcbb_gn_by_ctgn(in newIDGN int)
begin
	update GomNhom gn
	inner join (
		select ctgn.ID_GomNhom, COALESCE(sum(mh.soTinChi),0) as TongTC_GN 
		from ChiTietGomNhom ctgn
		left join MonHoc mh ON mh.id = ctgn.ID_MonHoc
		left join GomNhom gn on gn.ID = ctgn.ID_GomNhom
        where ctgn.isDeleted = false and mh.isDeleted = false and gn.isDeleted = false
		group by ctgn.ID_GomNhom) nt1 
	on gn.ID = nt1.ID_GomNhom 
	set gn.SoTCBB = nt1.TongTC_GN
    where gn.LoaiNhom = "BB" and gn.isDeleted = false;
end
$$
delimiter ;


# -------------------------------------------
DROP TRIGGER IF EXISTS trigger_update_gn;
delimiter $$
CREATE TRIGGER trigger_update_gn after update on GomNhom for each row
begin
	call procedure_update_ttc_lkkt_by_gn(new.ID_LoaiKhoiKienThuc);
end
$$
delimiter ;

DROP TRIGGER IF EXISTS trigger_insert_gn;
delimiter $$
CREATE TRIGGER trigger_insert_gn after insert on GomNhom for each row
begin
	call procedure_update_ttc_lkkt_by_gn(new.ID_LoaiKhoiKienThuc);
end
$$
delimiter ;

DROP procedure IF EXISTS procedure_update_ttc_lkkt_by_gn;
delimiter $$
create procedure procedure_update_ttc_lkkt_by_gn(in newIdLKKT int)
begin
	update LoaiKhoiKienThuc lkkt
	inner join (
		select lkkt_temp.ID, COALESCE(sum(gn.SoTCBB), 0) as TongTC
		from LoaiKhoiKienThuc lkkt_temp
		left join GomNhom gn ON gn.ID_LoaiKhoiKienThuc = lkkt_temp.ID
        where lkkt_temp.isDeleted = false and gn.isDeleted = false
		group by lkkt_temp.ID) nt1 
	on lkkt.ID = nt1.ID
	set lkkt.TongTC = nt1.TongTC;
end
$$
delimiter ;

# ------------------ LOAI KHOI KIEN THUC ------------------
DROP TRIGGER IF EXISTS trigger_update_loai_khoi_kien_thuc;
delimiter $$
CREATE TRIGGER trigger_update_loai_khoi_kien_thuc after update on LoaiKhoiKienThuc for each row
begin
	call procedure_update_ttc_kkt_by_lkkt(new.ID_KhoiKienThuc);
end
$$
delimiter ;

DROP TRIGGER IF EXISTS trigger_insert_loai_khoi_kien_thuc;
delimiter $$
CREATE TRIGGER trigger_insert_loai_khoi_kien_thuc after insert on LoaiKhoiKienThuc for each row
begin
	call procedure_update_ttc_kkt_by_lkkt(new.ID_KhoiKienThuc);
end
$$
delimiter ;

DROP procedure IF EXISTS procedure_update_ttc_kkt_by_lkkt;
delimiter $$
create procedure procedure_update_ttc_kkt_by_lkkt(in newIdKKT int)
begin
	update KhoiKienThuc kkt
	inner join (
		select kkt_temp.ID, COALESCE(sum(lkkt.TongTC), 0) as TongTC
		from KhoiKienThuc kkt_temp
		left join LoaiKhoiKienThuc lkkt ON lkkt.ID_KhoiKienThuc = kkt_temp.ID
        where kkt_temp.isDeleted = false and lkkt.isDeleted = false
		group by kkt_temp.ID) nt1 
	on kkt.ID = nt1.ID 
	set kkt.TongTC = nt1.TongTC;
end
$$
delimiter ;

# ------------------ KHOI KIEN THUC ------------------
DROP TRIGGER IF EXISTS trigger_update_khoi_kien_thuc;
delimiter $$
CREATE TRIGGER trigger_update_khoi_kien_thuc after update on KhoiKienThuc for each row
begin
	call procedure_update_ttc_ctdt_by_kkt();
end
$$
delimiter ;

DROP TRIGGER IF EXISTS trigger_insert_khoi_kien_thuc;
delimiter $$
CREATE TRIGGER trigger_insert_khoi_kien_thuc after insert on KhoiKienThuc for each row
begin
	call procedure_update_ttc_ctdt_by_kkt();
end
$$
delimiter ;

DROP procedure IF EXISTS procedure_update_ttc_ctdt_by_kkt;
delimiter $$
create procedure procedure_update_ttc_ctdt_by_kkt()
begin
	update ChuongTrinhDaoTao ctdt
	inner join (
		select ctdt_temp.ID, COALESCE(sum(kkt.TongTC), 0) as TongTC
		from ChuongTrinhDaoTao ctdt_temp
		left join NganhDaoTao ndt ON ndt.ctdtID = ctdt_temp.ID
        left join ChiTietNganhDaoTao ctndt on ctndt.ID_NganhDaoTao = ndt.ID
        left join KhoiKienThuc kkt on kkt.ID_ChiTietNganhDaoTao = ctndt.ID
		group by ctdt_temp.ID) nt1 
	on ctdt.ID = nt1.ID 
	set ctdt.TongTinChi = nt1.TongTC;
end
$$
delimiter ;

# ------------------ CHI TIET NGANH DAO TAO ------------------
DROP TRIGGER IF EXISTS trigger_update_chi_tiet_nganh_dao_tao;
delimiter $$
CREATE TRIGGER trigger_update_chi_tiet_nganh_dao_tao after update on ChiTietNganhDaoTao for each row
begin
	call procedure_update_ttc_ctdt_by_kkt();
end
$$
delimiter ;

DROP TRIGGER IF EXISTS trigger_insert_chi_tiet_nganh_dao_tao;
delimiter $$
CREATE TRIGGER trigger_insert_chi_tiet_nganh_dao_tao after insert on ChiTietNganhDaoTao for each row
begin
	call procedure_update_ttc_ctdt_by_kkt();
end
$$
delimiter ;

# ------------------ NGANH DAO TAO ------------------
DROP TRIGGER IF EXISTS trigger_update_nganh_dao_tao;
delimiter $$
CREATE TRIGGER trigger_update_nganh_dao_tao after update on NganhDaoTao for each row
begin
	call procedure_update_ttc_ctdt_by_kkt();
end
$$
delimiter ;

DROP TRIGGER IF EXISTS trigger_insert_nganh_dao_tao;
delimiter $$
CREATE TRIGGER trigger_insert_nganh_dao_tao after insert on NganhDaoTao for each row
begin
	call procedure_update_ttc_ctdt_by_kkt();
end
$$
delimiter ;