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
public class DetailReviewDto {
    private int dr_r_num;
    private char dr_healthy;
    private int dr_before;
    private String dr_before_p;
    private int dr_after1;
    private String dr_after1_p;
    private int dr_after2;
    private String dr_after2_p;
}
