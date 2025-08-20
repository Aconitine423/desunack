package com.desunack.desunack.DTO;

import com.desunack.desunack.Entity.C_member;
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
public class CustomerDto {
    private int customerUid;
    private String customerNickname;
    private char customerGender;
    private LocalDate customerBDay;
    private int customerPoint;
    private int customerRunningTotal;

    public C_member toEntity(){
        return C_member.builder().c_m_uid(this.customerUid).c_nickname(customerNickname)
                .c_gender(this.customerGender).c_birth(customerBDay)
                .c_point(this.customerPoint).c_running_total(this.customerRunningTotal).build();
    }
}
