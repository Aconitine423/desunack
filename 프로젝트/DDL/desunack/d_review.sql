create table d_review
(
    dr_r_num    int          not null
        primary key,
    dr_healthy  char         not null,
    dr_before   int          not null,
    dr_before_p varchar(255) not null,
    dr_after1   int          not null,
    dr_after1_p varchar(255) not null,
    dr_after2   int          not null,
    dr_after2_p varchar(255) not null,
    constraint fk_dr_r_num
        foreign key (dr_r_num) references review (r_num)
);

