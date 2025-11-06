create table member
(
    m_uid            int                      not null
        primary key,
    m_id             varchar(20)              null,
    m_name           varchar(20)              null,
    m_pw             varchar(255)             null,
    m_phone          varchar(255)             null,
    m_email          varchar(255)             null,
    m_post           varchar(10)              null,
    m_address        varchar(100)             null,
    m_address_detail varchar(50)              null,
    m_kind           char                     not null,
    m_status         char default '1'         not null,
    m_join_date      date default (curdate()) not null,
    m_recent_date    date default (curdate()) not null,
    constraint m_id
        unique (m_id)
);

