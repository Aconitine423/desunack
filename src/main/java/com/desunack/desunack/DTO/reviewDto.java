package com.desunack.desunack.DTO;
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
public class reviewDto {
    private int r_num;
    private int r_g_id;
    private int r_m_uid;
    private int r_rating;
    private String r_contents;
}
