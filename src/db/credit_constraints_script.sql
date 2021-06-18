# -------------------------------------------
DROP TRIGGER IF EXISTS update_tcbb_gn_by_mh;
delimiter $$
CREATE TRIGGER update_tcbb_gn_by_mh after update on monhoc for each row
begin
	if old.SoTinChi <> new.SoTinChi then
		update gomnhom gn
		inner join (
			select ctgn.ID_GomNhom, COALESCE(sum(mh.soTinChi),0) as TongTC_GN 
			from chitietgomnhom ctgn
			left join MonHoc mh ON mh.id = ctgn.ID_MonHoc
			left join GomNhom gn on gn.ID = ctgn.ID_GomNhom
            where mh.isDeleted = false and gn.isDeleted = false and ctgn.isDeleted = false
			group by ctgn.ID_GomNhom) nt1 
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
CREATE TRIGGER trigger_update_ctgn after update on chitietgomnhom for each row
begin
	call procedure_update_tcbb_gn_by_ctgn(new.ID_GomNhom);
end
$$
delimiter ;

DROP TRIGGER IF EXISTS trigger_insert_ctgn;
delimiter $$
CREATE TRIGGER trigger_insert_ctgn after insert on chitietgomnhom for each row
begin
	call procedure_update_tcbb_gn_by_ctgn(new.ID_GomNhom);
end
$$
delimiter ;

DROP procedure IF EXISTS procedure_update_tcbb_gn_by_ctgn;
delimiter $$
create procedure procedure_update_tcbb_gn_by_ctgn(in newIDGN int)
begin
	update gomnhom gn
	inner join (
		select ctgn.ID_GomNhom, COALESCE(sum(mh.soTinChi),0) as TongTC_GN 
		from chitietgomnhom ctgn
		left join monhoc mh ON mh.id = ctgn.ID_MonHoc
		left join gomnhom gn on gn.ID = ctgn.ID_GomNhom
        where gn.ID = newIDGN and ctgn.isDeleted = false and mh.isDeleted = false and gn.isDeleted = false
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
CREATE TRIGGER trigger_update_gn after update on gomnhom for each row
begin
	call procedure_update_ttc_lkkt_by_gn(new.ID_LoaiKhoiKienThuc);
end
$$
delimiter ;

DROP TRIGGER IF EXISTS trigger_insert_gn;
delimiter $$
CREATE TRIGGER trigger_insert_gn after insert on gomnhom for each row
begin
	call procedure_update_ttc_lkkt_by_gn(new.ID_LoaiKhoiKienThuc);
end
$$
delimiter ;

DROP procedure IF EXISTS procedure_update_ttc_lkkt_by_gn;
delimiter $$
create procedure procedure_update_ttc_lkkt_by_gn(in newIdLKKT int)
begin
	update loaikhoikienthuc lkkt
	inner join (
		select lkkt_temp.ID, COALESCE(sum(gn.SoTCBB), 0) as TongTC
		from loaikhoikienthuc lkkt_temp
		left join gomnhom gn ON gn.ID_LoaiKhoiKienThuc = lkkt_temp.ID
        where lkkt_temp.ID = newIdLKKT and lkkt_temp.isDeleted = false and gn.isDeleted = false
		group by lkkt_temp.ID) nt1 
	on lkkt.ID = nt1.ID
	set lkkt.TongTC = nt1.TongTC;
end
$$
delimiter ;
# ------- Caculator TongTinChi of khoi kien thuc when update
DROP TRIGGER IF EXISTS trigger_before_update_khoi_kien_thuc;
delimiter $$
CREATE TRIGGER trigger_before_update_khoi_kien_thuc before update on khoikienthuc for each row
begin
	set new.TongTC = new.TinChiTuChon + new.TCBatBuoc + new.TCTuChonTuDo;
end
$$
delimiter ;

# ------- Caculator TongTinChi of khoi kien thuc when insert
DROP TRIGGER IF EXISTS trigger_before_insert_khoi_kien_thuc;
delimiter $$
CREATE TRIGGER trigger_before_insert_khoi_kien_thuc before insert on khoikienthuc for each row
begin
	set new.TongTC = new.TinChiTuChon + new.TCBatBuoc + new.TCTuChonTuDo;
end
$$
delimiter ;

# ------- Update chi tiet nganh dao tao
DROP TRIGGER IF EXISTS trigger_update_khoi_kien_thuc;
delimiter $$
CREATE TRIGGER trigger_update_khoi_kien_thuc after update on khoikienthuc for each row
begin
	call procedure_update_ttc_ctndt_by_kkt(new.ID_ChiTietNganhDaoTao);
end
$$
delimiter ;

DROP TRIGGER IF EXISTS trigger_insert_khoi_kien_thuc;
delimiter $$
CREATE TRIGGER trigger_insert_khoi_kien_thuc after insert on khoikienthuc for each row
begin
	call procedure_update_ttc_ctndt_by_kkt(new.ID_ChiTietNganhDaoTao);
end
$$
delimiter ;

DROP procedure IF EXISTS procedure_update_ttc_ctndt_by_kkt;
delimiter $$
create procedure procedure_update_ttc_ctndt_by_kkt(in newIdCTNDT int)
begin
	update chitietnganhdaotao ctndt
	inner join (
		select kkt.ID_ChiTietNganhDaoTao , COALESCE(sum(kkt.TongTC), 0) as TongTC
        from chitietnganhdaotao ctndt_temp
        inner join khoikienthuc kkt on kkt.ID_ChiTietNganhDaoTao = ctndt_temp.ID
		where ctndt_temp.ID = newIdCTNDT
		group by kkt.ID_ChiTietNganhDaoTao) nt1 
	on ctndt.ID = nt1.ID_ChiTietNganhDaoTao 
	set ctndt.TongTinChi = nt1.TongTC;
end
$$
delimiter ;
