create table delivery_list
(
    dl_m_uid          int          not null,
    dl_shipping_name  varchar(10)  not null,
    dl_address        varchar(100) not null,
    dl_address_detail varchar(50)  null,
    dl_post           varchar(10)  not null,
    primary key (dl_m_uid, dl_shipping_name),
    constraint fk_dl_m_uid
        foreign key (dl_m_uid) references c_member (c_m_uid)
);

