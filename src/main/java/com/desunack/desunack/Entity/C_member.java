package com.desunack.desunack.Entity;

import com.desunack.desunack.DTO.CustomerDto;
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
@Accessors(chain = true)
public class C_member {
    private int c_m_uid;
    private String c_nickname;
    private char c_gender;
    private LocalDate c_birth;
    private int c_point;
    private int c_running_total;

    public CustomerDto toDto() {
        return CustomerDto.builder().customerUid(this.c_m_uid).customerNickname(this.c_nickname)
                .customerGender(this.c_gender).customerBDay(this.c_birth)
                .customerPoint(this.c_point).customerRunningTotal(this.c_running_total).build();
    }

    ;
}
