create table notice
(
    notice_id       int auto_increment
        primary key,
    notice_title    text     not null,
    notice_contents longtext not null
);

