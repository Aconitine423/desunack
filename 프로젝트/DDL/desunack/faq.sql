create table faq
(
    faq_id       int auto_increment
        primary key,
    faq_title    text     not null,
    faq_contents longtext not null
);

