create table category
(
    cat_key    int         not null
        primary key,
    cat_name   varchar(25) not null,
    parent_key int         null,
    constraint fk_parentkey
        foreign key (parent_key) references category (cat_key)
);

