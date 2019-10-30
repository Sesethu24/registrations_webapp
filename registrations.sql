create table towns(
	id serial not null primary key,
	town text not null,
	town_tag text not null
);

create table my_reg_numbers (
	id serial not null primary key,
    reg_numbers text not null,
	towns_id int,
	foreign key (towns_id) references towns(id)
);