package com.desunack.desunack.DTO;

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
public class customerDto {
    private String customerNickname;
    private int customerGender;
    private LocalDate customerBDay;
    private int customerPoint;
    private int customerRunningTotal;
}
