package com.desunack.desunack.Entity;

import com.desunack.desunack.DTO.SellerDto;
import com.desunack.desunack.DTO.UserDto;
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
public class SellerEntity {
    private MemberEntity memberEntity;
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

    // 판매자 Entity
    private String s_picture;
    private String s_account;
    private String s_bank;
    private String s_delivery;

//    public SellerDto toDto(MemberEntity mem) {
//        return SellerDto.builder().sellerNumImage(this.s_picture)
//                .sellerAccount(this.s_account)
//                .sellerBank(this.s_bank).sellerDelivery(this.s_delivery).userDto(mem.toDto()).build();
//    }
    public SellerDto toDto() {
        return SellerDto.builder().userUid(this.m_uid).userId(this.m_id).userName(this.m_name).userPw(this.m_pw)
                .userPhone(this.m_phone).userEmail(this.m_email).userPost(this.m_post).userAddress(this.m_address)
                .userAddressDetail(this.m_address_detail).userKind(this.m_kind).userStatus(this.m_status)
                .userSignupDate(this.m_join_date).userRecentDate(this.m_recent_date).sellerNumImage(this.s_picture)
                .sellerAccount(this.s_account).sellerBank(this.s_bank).sellerDelivery(this.s_delivery).build();
    }
}
