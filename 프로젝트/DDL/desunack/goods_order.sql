create table goods_order
(
    go_num                     int auto_increment
        primary key,
    go_m_uid                   int          null,
    go_receiver_name           varchar(20)  not null,
    go_receiver_phone          varchar(20)  not null,
    go_receiver_post           varchar(10)  not null,
    go_receiver_address        varchar(100) not null,
    go_receiver_address_detail varchar(50)  null,
    go_coupon                  int          null,
    go_point                   int          null,
    go_payments                varchar(10)  not null,
    go_total_cost              int          not null,
    go_status                  char         not null,
    go_earned_point            int          null,
    constraint fk_go_m_uid
        foreign key (go_m_uid) references c_member (c_m_uid)
);

