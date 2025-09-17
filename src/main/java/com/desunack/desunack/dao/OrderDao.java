package com.desunack.desunack.dao;


import com.desunack.desunack.dto.OrderDto;
import com.desunack.desunack.dto.ShoppingCartDto;
import com.desunack.desunack.entity.MemberEntity;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

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
}
