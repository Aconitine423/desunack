create table goods_sales
(
    gsa_g_id      int           not null,
    gsa_sales     int default 0 null,
    gsa_gender    char          not null,
    gsa_age_range int           not null,
    primary key (gsa_g_id, gsa_gender, gsa_age_range),
    constraint fk_gsa_g_id
        foreign key (gsa_g_id) references goods (g_id)
);

