create table review
(
    r_num      int auto_increment
        primary key,
    r_g_id     int  not null,
    r_m_uid    int  not null,
    r_rating   int  not null,
    r_contents text not null,
    constraint fk_r_g_id
        foreign key (r_g_id) references goods (g_id),
    constraint fk_r_m_uid
        foreign key (r_m_uid) references c_member (c_m_uid)
);

