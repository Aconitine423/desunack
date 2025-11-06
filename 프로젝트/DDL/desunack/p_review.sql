create table p_review
(
    pr_r_num   int         not null
        primary key,
    pr_picture varchar(50) not null,
    constraint fk_pr_r_num
        foreign key (pr_r_num) references review (r_num)
);

