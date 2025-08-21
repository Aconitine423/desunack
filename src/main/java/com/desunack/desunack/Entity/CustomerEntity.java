package com.desunack.desunack.Entity;

import com.desunack.desunack.DTO.CustomerDto;
import com.desunack.desunack.DTO.UserDto;
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
public class CustomerEntity {
    private MemberEntity memberEntity;
    private String c_nickname;
    private char c_gender;
    private LocalDate c_birth;
    private int c_point;
    private int c_running_total;

    public CustomerDto toDto(MemberEntity mem) {
        return CustomerDto.builder().customerNickname(this.c_nickname)
                .customerGender(this.c_gender).customerBDay(this.c_birth)
                .customerPoint(this.c_point).customerRunningTotal(this.c_running_total).userDto(mem.toDto()).build();
    }


    ;
}
