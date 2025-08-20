package com.desunack.desunack.Entity;
import com.desunack.desunack.DTO.ResignedUserDto;
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
public class Resigned_member {
    private int rm_num;
    private int rm_m_uid;
    private String rm_phone;
    private String rm_email;
    private LocalDate rm_resigned_date;
    private char rm_status;

    public ResignedUserDto toDto() {
        return ResignedUserDto.builder().ru_num(this.rm_num).ru_m_uid(this.rm_m_uid).ru_phone(this.rm_phone)
                .ru_email(this.rm_email).ru_resigned_date(this.rm_resigned_date).ru_status(this.rm_status).build();
    }
}
