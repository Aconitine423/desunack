package com.desunack.desunack.dao;

import com.desunack.desunack.dto.GoodsDto;
import jakarta.servlet.http.HttpSession;
import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;

@Mapper
public interface GoodsDao {
    boolean goodsRegistrate(GoodsDto goodsDto, HttpSession session);

    boolean goodsTotalSales(int g_id);

    boolean goodsSweetener(int g_id, ArrayList<String> sList);

    boolean goodsAllergy(int g_id, ArrayList<String> aList);
}
