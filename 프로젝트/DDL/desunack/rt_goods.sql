create table rt_goods
(
    rtg_rt_id      int not null,
    rtg_g_id       int not null,
    rtg_qty        int not null,
    rtg_total_cost int not null,
    primary key (rtg_rt_id, rtg_g_id),
    constraint fk_rtg_g_id
        foreign key (rtg_g_id) references goods (g_id),
    constraint fk_rtg_rt_id
        foreign key (rtg_rt_id) references routine (rt_id)
);

