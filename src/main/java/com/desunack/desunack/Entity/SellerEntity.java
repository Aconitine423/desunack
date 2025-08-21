package com.desunack.desunack.Entity;

import com.desunack.desunack.DTO.SellerDto;
import com.desunack.desunack.DTO.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Accessors(chain = true)
public class SellerEntity {
    private MemberEntity memberEntity;
    private String s_picture;
    private String s_account;
    private String s_bank;
    private String s_delivery;

    public SellerDto toDto(MemberEntity mem) {
        return SellerDto.builder().sellerNumImage(this.s_picture)
                .sellerAccount(this.s_account)
                .sellerBank(this.s_bank).sellerDelivery(this.s_delivery).userDto(mem.toDto()).build();
    }
}
