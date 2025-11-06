create table goods_total_sales
(
    gts_g_id  int           not null
        primary key,
    gts_sales int default 0 null,
    constraint fk_gts_g_id
        foreign key (gts_g_id) references goods (g_id)
);

