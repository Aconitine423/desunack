create table c_coupon
(
    cc_m_uid  int  not null,
    cc_cp_id  int  not null,
    cc_start  date not null,
    cc_end    date not null,
    cc_status char not null,
    primary key (cc_m_uid, cc_cp_id),
    constraint fk_cc_cp_id
        foreign key (cc_cp_id) references coupon (cp_id),
    constraint fk_cc_m_uid
        foreign key (cc_m_uid) references c_member (c_m_uid)
);

