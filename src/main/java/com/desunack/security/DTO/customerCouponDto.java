package com.desunack.desunack.DTO;
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
@Accessors(chain=true)
public class customerCouponDto {
    private int cc_m_uid;
    private int cc_cp_id;
    private LocalDate cc_start;
    private LocalDate cc_end;
    private char cc_status;
}
