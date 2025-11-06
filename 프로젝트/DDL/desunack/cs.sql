create table cs
(
    cs_id       int auto_increment
        primary key,
    cs_m_uid    int      not null,
    cs_title    text     not null,
    cs_contents longtext not null,
    cs_reply    longtext null,
    constraint fk_cs_m_uid
        foreign key (cs_m_uid) references member (m_uid)
);

