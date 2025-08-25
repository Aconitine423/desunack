package com.desunack.desunack.DTO;

import com.desunack.desunack.Entity.MemberEntity;
import com.desunack.desunack.Entity.SellerEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain=true)
@Builder
public class SellerDto {
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

    // 판매자 DTO
    private String sellerNumImage;
    private String sellerAccount;
    private String sellerBank;
    private String sellerDelivery;

//    public SellerEntity toEntity(UserDto uDto) {
//        return SellerEntity.builder().s_picture(this.sellerNumImage)
//                .s_account(this.sellerAccount).s_bank(this.sellerBank).s_delivery(this.sellerDelivery).memberEntity(uDto.toEntity()).build();
//    }
    public SellerEntity toEntity() {
        return SellerEntity.builder().m_uid(this.userUid).m_id(this.userId).m_name(this.userName).m_pw(this.userPw)
                .m_email(this.userEmail).m_post(this.userPost).m_address(this.userAddress)
                .m_address_detail(this.userAddressDetail).m_phone(this.userPhone).m_kind(this.userKind)
                .m_status(this.userStatus).m_join_date(this.userSignupDate).m_recent_date(this.userRecentDate)
                .s_picture(this.sellerNumImage).s_account(this.sellerAccount).s_bank(this.sellerBank)
                .s_delivery(this.sellerDelivery).build();
    }
}
