package com.desunack.desunack.Entity;
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
public class Delivery_list {
    private int dl_m_uid;
    private String dl_shipping_name;
    private String dl_address;
    private String dl_address_detail;
    private String dl_post;
}
