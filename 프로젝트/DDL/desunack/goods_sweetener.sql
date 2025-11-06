create table goods_sweetener
(
    gs_g_id  int not null,
    gs_s_key int not null,
    primary key (gs_g_id, gs_s_key),
    constraint fk_gs_g_id
        foreign key (gs_g_id) references goods (g_id),
    constraint fk_gs_key
        foreign key (gs_s_key) references sweetener (s_key)
);

