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
public class orderDetailDto {
    private int god_go_num;
    private int god_g_id;
    private int god_qty;
}
