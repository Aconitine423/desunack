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
public class resignedUserDto {
    private int ru_num;
    private int ru_m_uid;
    private String ru_phone;
    private String ru_email;
    private LocalDate ru_resigned_date;
    private char ru_status;
}
