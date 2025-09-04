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
public class TransferAllergyDto {
    private boolean allergy1;
    private boolean allergy2;
    private boolean allergy3;
    private boolean allergy4;
    private boolean allergy5;
    private boolean allergy6;
    private boolean allergy7;
    private boolean allergy8;
}
