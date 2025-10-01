package com.desunack.desunack.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;


// 최종적으로 Chart.js에 전달될 두 그룹의 데이터를 담는 메인 DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Accessors(chain = true)
public class BloodGlucoseSummaryDto {
    // 당뇨약 섭취 그룹의 평균 데이터 (dr_healthy='Y')
    private GlucoseGroup medication_y;
    // 당뇨약 비섭취 그룹의 평균 데이터 (dr_healthy='N')
    private GlucoseGroup medication_n;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Accessors(chain = true)
    public static class GlucoseGroup {
        // 필드명은 Java 관례(before)를 따르되, JSON 출력 시 이름을 대문자로 강제 지정
        // 섭취 전 평균 혈당 수치
        @JsonProperty("BEFORE")
        private double BEFORE;
        // 섭취 직후 (0시간 후) 평균 혈당 수치
        @JsonProperty("AFTER_0H")
        private double AFTER_0H;
        // 섭취 1시간 이후 평균 혈당 수치
        @JsonProperty("AFTER_1H")
        private double AFTER_1H;
    }
}
