package com.desunack.desunack.DTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;



@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Accessors(chain=true)
public class deliveryAddressDto {
    private int da_m_uid;
    private String da_shipping_name;
    private String da_address;
    private String da_address_detail;
    private String da_post;

}
