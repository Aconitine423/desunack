create table s_member
(
    s_m_uid      int          not null
        primary key,
    s_picture    varchar(255) null,
    s_account    varchar(50)  not null,
    s_bank       varchar(30)  not null,
    s_delivery   varchar(30)  null,
    s_seller_num char(12)     null,
    constraint fk_s_m_uid
        foreign key (s_m_uid) references member (m_uid)
);

