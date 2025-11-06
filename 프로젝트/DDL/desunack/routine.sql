create table routine
(
    rt_id     int     not null
        primary key,
    rt_m_uid  int     null,
    rt_count  int     null,
    rt_day    char(3) null,
    rt_cycle  int     null,
    rt_status char    null,
    constraint fk_rt_m_uid
        foreign key (rt_m_uid) references c_member (c_m_uid)
);

