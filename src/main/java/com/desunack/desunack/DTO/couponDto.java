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
public class couponDto {
    private int cp_id;
    private int cp_m_uid;
    private char cp_kind;
    private String cp_detail;
    private int cp_min;
    private int cp_max;
    private double cp_rate;
}
