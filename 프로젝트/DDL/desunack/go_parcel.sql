create table go_parcel
(
    gop_go_num   int  not null
        primary key,
    gop_pay_type char not null,
    gop_cost     int  not null,
    constraint fk_gop_go_num
        foreign key (gop_go_num) references goods_order (go_num)
);

