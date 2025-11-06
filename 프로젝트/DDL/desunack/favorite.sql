create table favorite
(
    f_m_uid int not null,
    f_g_id  int not null,
    primary key (f_m_uid, f_g_id),
    constraint fk_f_g_id
        foreign key (f_g_id) references goods (g_id),
    constraint fk_f_m_uid
        foreign key (f_m_uid) references c_member (c_m_uid)
);

