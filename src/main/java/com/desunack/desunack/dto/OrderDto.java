package com.desunack.desunack.dto;
import com.desunack.desunack.entity.OrderEntity;
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
public class OrderDto {
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

    public OrderEntity toEntity() {
        return OrderEntity.builder().go_num(this.order_num).go_m_uid(this.order_m_uid)
                .go_receiver_name(this.order_receiver_name)
                .go_receiver_phone(this.order_receiver_phone)
                .go_receiver_address(this.order_receiver_address)
                .go_receiver_address_detail(this.order_receiver_address_detail)
                .go_receiver_post(this.order_receiver_post).go_coupon(this.order_coupon)
                .go_point(this.order_point).go_payments(this.order_payments)
                .go_total_cost(this.order_total_cost).go_status(this.order_status).build();
    }
}
