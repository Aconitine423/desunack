package com.desunack.desunack.entity;

import com.desunack.desunack.dto.OrderDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Accessors(chain = true)
public class OrderEntity {
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
    private int go_earned_point;

    private int go_kind;

    private String goc_card_com;
    private int goc_card_installment;

    private char gop_pay_type;
    private int gop_cost;

    private int goo_cost;
    private LocalDate goo_time;

    public OrderDto toDto() {
        return OrderDto.builder().order_num(this.go_num).order_m_uid(this.go_m_uid).order_receiver_name(this.go_receiver_name)
                .order_receiver_phone(this.go_receiver_phone).order_receiver_address(this.go_receiver_address)
                .order_receiver_address_detail(this.go_receiver_address_detail).order_receiver_post(this.go_receiver_post)
                .order_coupon(this.go_coupon).order_point(this.go_point).order_payments(this.go_payments)
                .order_total_cost(this.go_total_cost).order_status(this.go_status).order_earned_point(this.go_earned_point).
                goc_card_com(this.goc_card_com).goc_card_installment(this.goc_card_installment)
                .gop_pay_type(this.gop_pay_type).gop_cost(this.gop_cost)
                .goo_cost(this.goo_cost).goo_time(this.goo_time).order_kind(this.go_kind).build();
    }
}
