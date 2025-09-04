package com.desunack.desunack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Accessors(chain=true)
public class TransferSweetenerDto {
    private boolean sweetener1;
    private boolean sweetener2;
    private boolean sweetener3;
    private boolean sweetener4;
    private boolean sweetener5;
    private boolean sweetener6;
    private boolean sweetener7;
    private boolean sweetener8;
    private boolean sweetener9;
    private boolean sweetener10;
}
