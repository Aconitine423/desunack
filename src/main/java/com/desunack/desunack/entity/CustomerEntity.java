package com.desunack.desunack.entity;

import com.desunack.desunack.dto.CustomerDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Accessors(chain = true)
public class CustomerEntity {
//    private MemberEntity memberEntity;
    // 회원공통 Entity
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

    // 소비자 Entity
    private String c_nickname;
    private char c_gender;
    private LocalDate c_birth;
    private int c_point;
    private int c_running_total;

//    public CustomerDto toDto(MemberEntity mem) {
//        return CustomerDto.builder().customerNickname(this.c_nickname)
//                .customerGender(this.c_gender).customerBDay(this.c_birth)
//                .customerPoint(this.c_point).customerRunningTotal(this.c_running_total).build();
//    }
    public CustomerDto toDto() {
        return CustomerDto.builder().userUid(this.m_uid).userId(this.m_id).userName(this.m_name)
                .userPw(this.m_pw).userPhone(this.m_phone).userEmail(this.m_email).userPost(this.m_post)
                .userAddress(this.m_address).userAddressDetail(this.m_address_detail).userKind(this.m_kind)
                .userStatus(this.m_status).userSignupDate(this.m_join_date).userRecentDate(this.m_recent_date)
                .customerNickname(this.c_nickname).customerGender(this.c_gender).customerBDay(this.c_birth)
                .customerPoint(this.c_point).customerRunningTotal(this.c_running_total).build();
    }
}
