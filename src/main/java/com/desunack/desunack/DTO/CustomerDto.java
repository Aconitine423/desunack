package com.desunack.desunack.DTO;

import com.desunack.desunack.Entity.CustomerEntity;
import com.desunack.desunack.Entity.MemberEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;

@Data
@Accessors(chain=true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerDto {
    //    private UserDto userDto;
    // 회원공통 DTO
    private int userUid;
    private String userId;
    private String userName;
    private String userPw;
    private String userEmail;
    private String userPost;
    private String userAddress;
    private String userAddressDetail;
    private String userPhone;
    private char userKind;
    private char userStatus;
    private LocalDate userSignupDate;
    private LocalDate userRecentDate;

    // 소비자 DTO
    private String customerNickname;
    private char customerGender;
    private LocalDate customerBDay;
    private int customerPoint;
    private int customerRunningTotal;

//    public CustomerEntity toEntity(UserDto uDto) {
//        return CustomerEntity.builder().c_nickname(this.customerNickname)
//                .c_gender(this.customerGender).c_birth(this.customerBDay)
//                .c_point(this.customerPoint).c_running_total(this.customerRunningTotal).memberEntity(uDto.toEntity())
//                .build();
//        }
        public CustomerEntity toEntity() {
        return CustomerEntity.builder().m_uid(this.userUid).m_id(this.userId).m_name(this.userName).m_pw(this.userPw)
                .m_email(this.userEmail).m_post(this.userPost).m_address(this.userAddress)
                .m_address_detail(this.userAddressDetail).m_phone(this.userPhone).m_kind(this.userKind)
                .m_status(this.userStatus).m_join_date(this.userSignupDate).m_recent_date(this.userRecentDate)
                .c_nickname(this.customerNickname).c_gender(this.customerGender).c_birth(this.customerBDay)
                .c_point(this.customerPoint).c_running_total(this.customerRunningTotal).build();
    }
}
