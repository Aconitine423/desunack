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
public class c_member {
    private int c_m_uid;
    private String c_nickname;
    private char c_gender;
    private LocalDate c_birth;
    private int c_point;
    private int c_running_total;
}
