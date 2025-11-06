create table shopping_cart
(
    sc_m_uid int not null,
    sc_g_id  int not null,
    sc_qty   int not null,
    primary key (sc_m_uid, sc_g_id),
    constraint fk_sc_g_id
        foreign key (sc_g_id) references goods (g_id),
    constraint fk_sc_m_uid
        foreign key (sc_m_uid) references c_member (c_m_uid)
);

