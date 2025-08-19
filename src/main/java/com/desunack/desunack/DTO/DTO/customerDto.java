package com.desunack.desunack.DTO.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@Accessors(chain=true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class customerDto {
    private String customerNickname;
    private String customerGender;
    private String customerBDay;
    private String customerPoint;
    private String customerRunningTotal;
}
