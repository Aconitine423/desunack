package com.desunack.desunack.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Accessors(chain=true)
public class GoodsDto {
    private int g_id;
    private int g_m_uid;
    private String brand_name;
    private String g_name;
    private String company_name;
    private int g_value;
    private int g_qty;
    private LocalDate g_startday;
    private LocalDate g_endday;
    private int g_cat_key;
    private String g_image;
    private String g_detail;
    private String g_delivery_kind;
    private char g_status;
    private int g_total_rating;
    private int g_review_count;
    private String aList;
    private String sList;
}
