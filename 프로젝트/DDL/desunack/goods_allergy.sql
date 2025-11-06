create table goods_allergy
(
    ga_g_id  int not null,
    ga_a_key int not null,
    primary key (ga_g_id, ga_a_key),
    constraint fk_ga_g_id
        foreign key (ga_g_id) references goods (g_id),
    constraint fk_ga_key
        foreign key (ga_a_key) references allergy (a_key)
);

