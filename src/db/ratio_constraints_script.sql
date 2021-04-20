use `qHtJYlp09Y`;
SET SQL_SAFE_UPDATES = 0;

# -------------------------------------------
DROP TRIGGER IF EXISTS trigger_update_hoat_dong_danh_gia;
delimiter $$
CREATE TRIGGER trigger_update_hoat_dong_danh_gia after update on HoatDongDanhGia for each row
begin
	if old.tyLe <> new.tyLe then
		call procedure_update_ty_le_loai_danh_gia(new.idLDG);
	end if;
end
$$

DROP TRIGGER IF EXISTS trigger_insert_hoat_dong_danh_gia;
delimiter $$
CREATE TRIGGER trigger_insert_hoat_dong_danh_gia after insert on HoatDongDanhGia for each row
begin
	call procedure_update_ty_le_loai_danh_gia(new.idLDG);
end
$$

DROP procedure IF EXISTS procedure_update_ty_le_loai_danh_gia;
delimiter $$
create procedure procedure_update_ty_le_loai_danh_gia(in newIDLDG int)
begin
	update LoaiDanhGia ldg
	inner join (
		select hddg.idLDG, sum(hddg.ty_le) as Tongty_le 
		from HoatDongDanhGia hddg
		group by hddg.idLDG
        having hddg.idLDG = newIDLDG) nt1 
	on ldg.ID = nt1.idLDG
	set ldg.ty_le = nt1.Tongty_le;
end
$$
delimiter ;

# -------------------------------------------
DROP TRIGGER IF EXISTS trigger_insert_loai_danh_gia;
delimiter $$
CREATE TRIGGER trigger_insert_loai_danh_gia before insert on LoaiDanhGia for each row
begin
	call procedure_check_ration(new.idSyllabus, new.tyLe);
end
$$
delimiter ;

DROP TRIGGER IF EXISTS trigger_update_loai_danh_gia;
delimiter $$
CREATE TRIGGER trigger_update_loai_danh_gia before update on LoaiDanhGia for each row
begin
	call procedure_check_ration(new.idSyllabus, new.tyLe);
end
$$
delimiter ;

DROP procedure IF EXISTS procedure_check_ration;
delimiter $$
create procedure procedure_check_ration(in newIDSyllabus int, in newTyLe double)
begin
	declare s double;
    select sum(ldg.tyLe) into s
    from LoaiDanhGia ldg
    where ldg.idLDG = newIDSyllabus;
    
    if(s + newTyLe > 1.0) then
		signal sqlstate '45000'
			set message_text = 'Sum of ration not greater than 100%';
    end if;
end
$$
delimiter ;