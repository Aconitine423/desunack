package com.desunack.desunack.DTO;
import com.desunack.desunack.Entity.DeliveryAddressEntity;
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
public class DeliveryAddressDto {
    private int da_m_uid;
    private String da_shipping_name;
    private String da_address;
    private String da_address_detail;
    private String da_post;

    public DeliveryAddressEntity toEntity() {
        return DeliveryAddressEntity.builder().dl_m_uid(this.da_m_uid).dl_shipping_name(this.da_shipping_name)
                .dl_address(this.da_address).dl_address_detail(this.da_address_detail).dl_post(this.da_post).build();
    }
}
