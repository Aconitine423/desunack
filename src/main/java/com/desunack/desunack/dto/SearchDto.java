package com.desunack.desunack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Accessors(chain=true)
public class SearchDto {
    private List<String> sweeteners;
    private List<String> allergies;
    //알러지
    String egg;
    String fish;
    String milk;
    String nuts;
    String peanut;
    String shellfish;
    String soybean;
    String wheat;

    //대체당
    String acesulfame_potassium;
    String allulose;
    String aspartame;
    String erythritol;
    String maltitol;
    String saccharin;
    String sorbitol;
    String stevia;
    String sucralose;
    String xylitol;
}
