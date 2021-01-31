create database spms;
create table user (
	id INT,
	firstname VARCHAR(50),
	lastname VARCHAR(50),
	username VARCHAR(50),
	u_password VARCHAR(50),
    isActive boolean default true
);
insert into user (id, firstname, lastname, username, u_password) values (1, 'Hasheem', 'Miguel', 'hmiguel0', 'IOAlFlNwjU4');
insert into user (id, firstname, lastname, username, u_password) values (2, 'Herculie', 'Chumley', 'hchumley1', 'mg5gd6EQ');
insert into user (id, firstname, lastname, username, u_password) values (3, 'Britni', 'Turbitt', 'bturbitt2', 'YCpqwesdbJA');
insert into user (id, firstname, lastname, username, u_password) values (4, 'Shannah', 'Prestie', 'sprestie3', 'hIRF4gq');
insert into user (id, firstname, lastname, username, u_password) values (5, 'Donaugh', 'Hindmoor', 'dhindmoor4', 'Lv3U3LEQRRo');
insert into user (id, firstname, lastname, username, u_password) values (6, 'Frans', 'Orfeur', 'forfeur5', 'ZycfbgDZ9yb7');
insert into user (id, firstname, lastname, username, u_password) values (7, 'Ericha', 'Guinn', 'eguinn6', '7yOwjYPu');
insert into user (id, firstname, lastname, username, u_password) values (8, 'Inger', 'Lovemore', 'ilovemore7', 'iapel5');
insert into user (id, firstname, lastname, username, u_password) values (9, 'Genevieve', 'Hegley', 'ghegley8', 'fmVBXA6Q5B');
insert into user (id, firstname, lastname, username, u_password) values (10, 'Thanh Tung', 'Nguyen', 'nttung', '123456');