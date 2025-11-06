create table go_detail
(
    god_go_num int not null,
    god_g_id   int not null,
    god_qty    int not null,
    primary key (god_go_num, god_g_id),
    constraint fk_god_g_id
        foreign key (god_g_id) references goods (g_id),
    constraint fk_god_go_num
        foreign key (god_go_num) references goods_order (go_num)
);

