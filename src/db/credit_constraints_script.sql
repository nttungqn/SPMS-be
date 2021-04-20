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
			select ctgn.ID_GomNhom, sum(mh.soTinChi) as TongTC_GN 
			from ChiTietGomNhom ctgn
			inner join MonHoc mh ON mh.id = ctgn.ID_MonHoc
			inner join GomNhom gn on gn.ID = ctgn.ID_GomNhom
			group by ctgn.ID_GomNhom ) nt1 
		on gn.ID = nt1.ID_GomNhom
		set gn.SoTCBB = nt1.TongTC_GN
        where gn.LoaiNhom = "BB";
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
		select ctgn.ID_GomNhom, sum(mh.soTinChi) as TongTC_GN 
		from ChiTietGomNhom ctgn
		inner join MonHoc mh ON mh.id = ctgn.ID_MonHoc
		inner join GomNhom gn on gn.ID = ctgn.ID_GomNhom
		group by ctgn.ID_GomNhom
        having ctgn.ID_GomNhom = newIDGN) nt1 
	on gn.ID = nt1.ID_GomNhom 
	set gn.SoTCBB = nt1.TongTC_GN
    where gn.LoaiNhom = "BB";
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
		select lkkt_temp.ID_KhoiKienThuc, sum(gn.SoTCBB) as TongTC
		from LoaiKhoiKienThuc lkkt_temp
		inner join GomNhom gn ON gn.ID_LoaiKhoiKienThuc = lkkt_temp.ID
		group by lkkt_temp.ID
        having lkkt_temp.ID = newIdLKKT) nt1 
	on lkkt.ID = nt1.ID_KhoiKienThuc 
	set lkkt.TongTC = nt1.TongTC;
end
$$
delimiter ;