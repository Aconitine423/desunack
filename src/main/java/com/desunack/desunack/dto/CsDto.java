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
public class CsDto {
    private int cs_id;
    private int cs_m_uid;
    private String cs_title;
    private String cs_contents;
    private String cs_reply;
}
