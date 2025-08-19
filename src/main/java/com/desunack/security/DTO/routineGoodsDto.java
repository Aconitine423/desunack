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
public class routineGoodsDto {
    private int rtg_rt_id;
    private int rtg_g_id;
    private int rtg_qty;
    private int rtg_total_cost;
}
