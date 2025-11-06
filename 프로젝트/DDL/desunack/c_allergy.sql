create table c_allergy
(
    ca_m_uid int not null,
    ca_a_key int not null,
    primary key (ca_m_uid, ca_a_key),
    constraint fk_ca_a_key
        foreign key (ca_a_key) references allergy (a_key),
    constraint fk_ca_m_uid
        foreign key (ca_m_uid) references c_member (c_m_uid)
);

