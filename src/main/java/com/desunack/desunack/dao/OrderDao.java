package com.desunack.desunack.dao;


import com.desunack.desunack.dto.OrderDto;
import com.desunack.desunack.dto.ShoppingCartDto;
import com.desunack.desunack.entity.MemberEntity;
import com.desunack.desunack.entity.OrderEntity;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.ArrayList;
import java.util.List;

@Mapper
public interface OrderDao {

    @Select("select m_uid, m_name, m_phone, m_post, m_address, m_address_detail from member where m_uid = ${userUid}")
    MemberEntity getUserInfo(int userUid);

    int makeOrder(MemberEntity mEntity, int total_cost);


    @Select("select g_value from goods where g_id = ${scGId}")
    int getCost(int scGId);

    @Select("select * from goods_order where go_num = ${goNum}")
    OrderDto getOrderInfo(int goNum);


    void updateOrder(OrderEntity oEntity);

    void insertOrderDetail(List<ShoppingCartDto> scList, int god_go_num);

    @Insert("insert into go_card(goc_go_num, goc_card_com, goc_card_installment) values (${go_num}, ${goc_card_com}, ${goc_card_installment})")
    void insertCard(OrderEntity oEntity);

    @Insert("insert into go_own(goo_go_num, goo_cost, goo_time) values (${go_num}, ${goo_cost}, ${goo_time})")
    void insertOwn(OrderEntity oEntity);

    @Insert("insert into go_parcel(gop_go_num, gop_cost, gop_pay_type) values (${go_num}, ${gop_cost}, ${gop_pay_type})")
    void insertParcel(OrderEntity oEntity);

    void deleteShoppingCart(List<ShoppingCartDto> scList);

    ArrayList<String> getGoodsInfo(List<Integer> idList);

    @Select("select sc_qty from shopping_cart where sc_g_id = ${id} and sc_m_uid = ${userUid}")
    int getQty(int userUid, int id);

    ArrayList<String> getShoppingCart(int userUid, List<Integer> idList);
}
