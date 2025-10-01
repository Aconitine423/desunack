package com.desunack.desunack.dao;

import com.desunack.desunack.dto.FavoriteDto;
import com.desunack.desunack.dto.GoodsDto;
import com.desunack.desunack.dto.GoodsInfoDto;
import com.desunack.desunack.dto.ShoppingCartDto;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

    @Insert("insert into favorite(f_g_id, f_m_uid) values(#{f_g_id}, #{f_m_uid})")
    void insertFavorite(FavoriteDto fDto);

    @Insert("insert into shopping_cart(sc_g_id, sc_m_uid, sc_qty) values(#{sc_g_id}, #{sc_m_uid}, #{sc_qty})")
    void insertCart(ShoppingCartDto scDto);

    ArrayList<String> getShoppingCart(int userUid);

    @Delete("delete from shopping_cart where sc_g_id = #{g_id} and sc_m_uid = #{m_uid}")
    void deleteShoppingCart(int g_id, int m_uid);


    ArrayList<String> getFavorite(int userUid);

    @Delete("delete from favorite where f_g_id = #{g_id} and f_m_uid = #{m_uid}")
    void deleteFavorite(int g_id, int m_uid);

    List<Map<String, Object>> findAvgGlucoseGroupedByHealthyStatus(int gId);
}
