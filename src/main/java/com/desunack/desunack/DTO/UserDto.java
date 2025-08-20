package com.desunack.desunack.DTO;

import com.desunack.desunack.Entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;

@Data
@Accessors(chain = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
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

    public Member toEntity() {
        return Member.builder().m_uid(this.userUid).m_id(this.userId).m_name(this.userName).m_pw(this.userPw)
                .m_email(this.userEmail).m_post(this.userPost).m_phone(this.userPhone).m_address(this.userAddress)
                .m_address_detail(this.userAddressDetail).m_kind(this.userKind).m_status(this.userStatus)
                .m_join_date(this.userSignupDate).m_recent_date(this.userRecentDate).build();
    }

}

