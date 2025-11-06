create table goods_info
(
    gi_g_id     int          not null
        primary key,
    gi_kind     varchar(20)  not null,
    gi_origin   varchar(25)  not null,
    gi_factory  varchar(20)  not null,
    gi_caution  varchar(100) not null,
    gi_cs_phone varchar(20)  not null,
    constraint fk_gi_g_id
        foreign key (gi_g_id) references goods (g_id)
);

