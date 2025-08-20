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
public class GoodsInfoDto {
    private int gi_g_id;
    private String gi_kind;
    private String gi_origin;
    private String gi_factory;
    private String gi_caution;
    private String gi_cs_phone;
}
