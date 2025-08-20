package com.desunack.desunack.Entity;
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
public class resigned_member {
    private int rm_num;
    private int rm_m_uid;
    private String rm_phone;
    private String rm_email;
    private LocalDate rm_resigned_date;
    private char rm_status;
}
