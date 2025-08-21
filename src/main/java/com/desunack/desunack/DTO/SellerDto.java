package com.desunack.desunack.DTO;

import com.desunack.desunack.Entity.MemberEntity;
import com.desunack.desunack.Entity.SellerEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain=true)
@Builder
public class SellerDto {
    private UserDto userDto;
    private String sellerNumImage;
    private String sellerAccount;
    private String sellerBank;
    private String sellerDelivery;

    public SellerEntity toEntity() {
        MemberEntity mem = userDto.toEntity();
        return SellerEntity.builder().s_picture(this.sellerNumImage)
                .s_account(this.sellerAccount).s_bank(this.sellerBank).s_delivery(this.sellerDelivery).memberEntity(mem).build();
    }
}
