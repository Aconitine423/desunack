package com.desunack.desunack.dao;

import com.desunack.desunack.dto.GoodsDto;
import jakarta.servlet.http.HttpSession;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Mapper
public interface GoodsDao {
    boolean goodsRegistrate(GoodsDto goodsDto);

    boolean goodsTotalSales(int g_id);

    boolean goodsSweetener(int g_id, String sList);

    boolean goodsAllergy(int g_id, String aList);
}
