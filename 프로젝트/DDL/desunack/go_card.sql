create table go_card
(
    goc_go_num           int           not null
        primary key,
    goc_card_com         varchar(10)   not null,
    goc_card_installment int default 0 null,
    constraint fk_goc_go_num
        foreign key (goc_go_num) references goods_order (go_num)
);

