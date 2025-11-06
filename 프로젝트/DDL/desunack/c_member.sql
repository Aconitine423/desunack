create table c_member
(
    c_m_uid         int           not null
        primary key,
    c_nickname      varchar(20)   null,
    c_gender        char          not null,
    c_birth         date          not null,
    c_point         int default 0 not null,
    c_running_total int default 0 not null,
    constraint c_nickname
        unique (c_nickname),
    constraint fk_c_m_uid
        foreign key (c_m_uid) references member (m_uid)
);

