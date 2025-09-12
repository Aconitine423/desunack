package com.desunack.desunack.dao;

import com.desunack.desunack.dto.GoodsDto;
import com.desunack.desunack.dto.GoodsInfoDto;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;

@Mapper
public interface GoodsDao {
    boolean goodsRegistrate(GoodsDto goodsDto);

    boolean goodsTotalSales(int g_id);

    boolean goodsSweetener(int g_id, ArrayList<Integer> sList);

    boolean goodsAllergy(int g_id, ArrayList<Integer> aList);

    boolean goodsInfo(GoodsInfoDto giDto);

    GoodsDto getGoods(int g_id);

    GoodsInfoDto getGoodsInfo(int g_id);

    ArrayList<String> getReviewList(int g_id);

    @Insert("insert into favorite(f_g_id, f_m_uid) values(${g_id}, ${userUid})")
    void insertFavorite(int g_id, int userUid);
}
