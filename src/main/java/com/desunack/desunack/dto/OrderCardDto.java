package com.desunack.desunack.dto;
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
public class OrderCardDto {
    private int goc_go_num;
    private String goc_card_com;
    private int goc_card_installment;
}
