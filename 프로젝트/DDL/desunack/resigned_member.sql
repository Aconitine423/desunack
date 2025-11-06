create table resigned_member
(
    rm_num           int auto_increment
        primary key,
    rm_m_uid         int          not null,
    rm_phone         varchar(255) not null,
    rm_email         varchar(255) not null,
    rm_resigned_date date         not null,
    rm_status        char         not null,
    constraint fk_rm_m_uid
        foreign key (rm_m_uid) references member (m_uid)
);

