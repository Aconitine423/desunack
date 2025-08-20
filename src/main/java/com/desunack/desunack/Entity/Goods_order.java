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
public class Goods_order {
    private int go_num;
    private int go_m_uid;
    private String go_receiver_name;
    private String go_receiver_phone;
    private String go_receiver_address;
    private String go_receiver_address_detail;
    private String go_receiver_post;
    private int go_coupon;
    private int go_point;
    private String go_payments;
    private int go_total_cost;
    private char go_status;
}
