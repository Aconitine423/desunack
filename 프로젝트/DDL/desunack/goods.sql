create table goods
(
    g_id            int auto_increment
        primary key,
    g_m_uid         int           not null,
    brand_name      varchar(10)   not null,
    g_name          varchar(50)   not null,
    company_name    varchar(25)   not null,
    g_value         int           not null,
    g_qty           int           not null,
    g_startday      date          not null,
    g_endday        date          not null,
    g_cat_key       int           not null,
    g_image         varchar(50)   not null,
    g_detail        longtext      not null,
    g_delivery_kind varchar(10)   not null,
    g_status        char          not null,
    g_total_rating  int default 0 not null,
    g_review_count  int default 0 not null,
    constraint fk_cat_key
        foreign key (g_cat_key) references category (cat_key),
    constraint fk_g_m_uid
        foreign key (g_m_uid) references s_member (s_m_uid)
);

