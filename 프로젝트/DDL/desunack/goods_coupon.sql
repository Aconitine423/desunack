create table goods_coupon
(
    gc_cp_id int not null,
    gc_g_id  int not null,
    primary key (gc_cp_id, gc_g_id),
    constraint fk_gc_cp_id
        foreign key (gc_cp_id) references coupon (cp_id),
    constraint fk_gc_g_id
        foreign key (gc_g_id) references goods (g_id)
);

