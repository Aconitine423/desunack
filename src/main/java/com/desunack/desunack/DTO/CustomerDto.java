package com.desunack.desunack.DTO;

import com.desunack.desunack.Entity.CustomerEntity;
import com.desunack.desunack.Entity.MemberEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;

@Data
@Accessors(chain=true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerDto{
    private UserDto userDto;
    private String customerNickname;
    private char customerGender;
    private LocalDate customerBDay;
    private int customerPoint;
    private int customerRunningTotal;

    public CustomerEntity toEntity(){
        MemberEntity mem = userDto.toEntity();
        return CustomerEntity.builder().c_nickname(customerNickname)
                .c_gender(this.customerGender).c_birth(customerBDay)
                .c_point(this.customerPoint).c_running_total(this.customerRunningTotal).memberEntity(mem).build();
    }
}
