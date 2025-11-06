create table go_own
(
    goo_go_num int      not null
        primary key,
    goo_cost   int      not null,
    goo_time   datetime not null,
    constraint fk_goo_go_num
        foreign key (goo_go_num) references goods_order (go_num)
);

