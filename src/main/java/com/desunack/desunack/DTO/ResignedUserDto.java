package com.desunack.desunack.DTO;

import com.desunack.desunack.Entity.Resigned_member;
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
public class ResignedUserDto {
    private int ru_num;
    private int ru_m_uid;
    private String ru_phone;
    private String ru_email;
    private LocalDate ru_resigned_date;
    private char ru_status;

    public Resigned_member toEntity() {
        return Resigned_member.builder().rm_num(this.ru_num).rm_m_uid(this.ru_m_uid)
                .rm_phone(this.ru_phone).rm_email(this.ru_email).rm_resigned_date(this.ru_resigned_date)
                .rm_status(this.ru_status).build();
    }
}
