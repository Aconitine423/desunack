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
public class RoutineDto {
    private int rt_id;
    private int rt_m_uid;
    private int rt_count;
    private String rt_day;
    private int rt_cycle;
    private char rt_status;
}
