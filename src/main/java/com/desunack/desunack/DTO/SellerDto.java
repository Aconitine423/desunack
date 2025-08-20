package com.desunack.desunack.DTO;

import com.desunack.desunack.Entity.S_member;
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
    private int sellerUid;
    private String sellerNumImage;
    private String sellerAccount;
    private String sellerBank;
    private String sellerDelivery;

    public S_member toEntity() {
        return S_member.builder().s_m_uid(this.sellerUid).s_picture(this.sellerNumImage)
                .s_account(this.sellerAccount).s_bank(this.sellerBank).s_delivery(this.sellerDelivery).build();
    }
}
