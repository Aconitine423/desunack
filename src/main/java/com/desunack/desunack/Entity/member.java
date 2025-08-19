package com.desunack.desunack.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class member {
    @Id
    private int m_uid;

    private String m_id;
    private String m_name;
    private String m_pw;
    private String m_phone;
    private String m_email;
    private String m_post;
    private String m_address;
    private String m_address_detail;
    private char m_kind;
    private char m_status;
    private LocalDate m_join_date;
    private LocalDate m_recent_date;
}
