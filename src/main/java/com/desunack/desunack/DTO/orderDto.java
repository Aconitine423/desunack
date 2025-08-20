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
public class orderDto {
    private int order_num;
    private int order_m_uid;
    private String order_receiver_name;
    private String order_receiver_phone;
    private String order_receiver_address;
    private String order_receiver_post;
    private String order_receiver_address_detail;
    private int order_coupon;
    private int order_point;
    private String order_payments;
    private int order_total_cost;
    private char order_status;
}
