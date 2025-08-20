package com.desunack.desunack.DTO;

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
public class sellerDto {
    private String sellerNumImage;
    private String sellerAccount;
    private String sellerBank;
    private String sellerDelivery;
}
