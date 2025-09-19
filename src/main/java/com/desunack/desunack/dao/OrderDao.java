package com.desunack.desunack.dao;


import com.desunack.desunack.dto.OrderDto;
import com.desunack.desunack.dto.ShoppingCartDto;
import com.desunack.desunack.entity.MemberEntity;
import com.desunack.desunack.entity.OrderEntity;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Mapper
public interface OrderDao {

    @Select("select m_uid, m_name, m_phone, m_post, m_address, m_address_detail from member where m_uid = #{userUid}")
    MemberEntity getUserInfo(int userUid);

    int makeOrder(MemberEntity mEntity, int total_cost);


    @Select("select g_value from goods where g_id = #{scGId}")
    int getCost(int scGId);

    @Select("select * from goods_order where go_num = #{go_num}")
    OrderEntity getOrderInfo(int go_num);


    void updateOrder(OrderEntity oEntity);

    void insertOrderDetail(List<ShoppingCartDto> scList, int god_go_num);

    @Insert("insert into go_card(goc_go_num, goc_card_com, goc_card_installment) values (#{go_num}, #{goc_card_com}, #{goc_card_installment})")
    void insertCard(OrderEntity oEntity);

    @Insert("insert into go_own(goo_go_num, goo_cost, goo_time) values (#{go_num}, #{goo_cost}, #{goo_time})")
    void insertOwn(OrderEntity oEntity);

    @Insert("insert into go_parcel(gop_go_num, gop_cost, gop_pay_type) values (#{go_num}, #{gop_cost}, #{gop_pay_type})")
    void insertParcel(OrderEntity oEntity);

    void deleteShoppingCart(List<Integer> idList, int uid);

    ArrayList<String> getGoodsInfo(List<Integer> idList);

    @Select("select sc_qty from shopping_cart where sc_g_id = #{id} and sc_m_uid = #{userUid}")
    int getQty(int userUid, int id);

    ArrayList<String> getShoppingCartString(int userUid, List<Integer> idList);

    @Select("select go_num from goods_order where go_m_uid = #{m_uid} order by go_num desc limit 0, 1")
    int getOrderNum(MemberEntity mEntity);

    List<ShoppingCartDto> getShoppingCart(int mUid, List<Integer> idList);

    void updateGoods(ShoppingCartDto scDto);

    @Select("select c_birth from c_member where c_m_uid = #{mUid}")
    LocalDate getAge(int mUid);

    @Select("select c_gender from c_member where c_m_uid = #{mUid}")
    char getGender(int mUid);

    @Update("update goods_total_sales set gts_sales = gts_sales + #{sc_qty} where gts_g_id = #{sc_g_id}")
    void updateTotalSales(ShoppingCartDto scDto);

    @Select ("select count(*) from goods_sales where gsa_age_range = #{age} and gsa_gender = #{gender} and gsa_g_id = #{scDto.sc_g_id}")
    int nullCheckSales(ShoppingCartDto scDto, int age, char gender);

    @Update("update goods_sales set gsa_sales = gsa_sales + #{scDto.sc_qty} where gsa_g_id = #{scDto.sc_g_id} and gsa_gender = #{gender} and gsa_age_range = #{age}")
    void updateSales(ShoppingCartDto scDto, int age, char gender);

    @Insert("insert goods_sales(gsa_g_id, gsa_sales, gsa_age_range, gsa_gender) values (#{scDto.sc_g_id}, #{scDto.sc_qty}, #{age}, #{gender})")
    void insertSales(ShoppingCartDto scDto, int age, char gender);
}
