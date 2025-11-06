create table coupon
(
    cp_id     int         not null
        primary key,
    cp_m_uid  int         not null,
    cp_kind   char        not null,
    cp_detail varchar(50) not null,
    cp_min    int         not null,
    cp_max    int         not null,
    cp_rate   double      not null,
    constraint fk_cp_m_uid
        foreign key (cp_m_uid) references member (m_uid)
);

