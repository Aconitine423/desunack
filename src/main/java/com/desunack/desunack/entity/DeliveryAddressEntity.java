package com.desunack.desunack.entity;
import com.desunack.desunack.dto.DeliveryAddressDto;
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
public class DeliveryAddressEntity {
    private int dl_m_uid;
    private String dl_shipping_name;
    private String dl_address;
    private String dl_address_detail;
    private String dl_post;

    public DeliveryAddressDto toDto(){
        return DeliveryAddressDto.builder().da_m_uid(this.dl_m_uid).da_shipping_name(this.dl_shipping_name)
                .da_address(this.dl_address).da_address_detail(this.dl_address_detail).da_post(this.dl_post).build();
    }
}
