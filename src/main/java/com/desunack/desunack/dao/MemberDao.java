package com.desunack.desunack.dao;

import com.desunack.desunack.entity.CustomerEntity;
import com.desunack.desunack.entity.MemberEntity;
import com.desunack.desunack.entity.SellerEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.ArrayList;

@Mapper
public interface MemberDao {

    @Select("select m_pw from member where m_id = #{m_id}")
    String getSecurityPw(String m_id);

    MemberEntity getMemberEntity(String m_id);


    CustomerEntity getCustomerEntity(int m_uid);

    SellerEntity getSellerEntity(int m_uid);

    @Select("select m_id from member where m_name = #{m_name} and m_email = #{m_email}")
    String findId(String m_name, String m_email);

    int findPw(String m_id, String m_email);

    void memberJoin(CustomerEntity customerEntity);

    boolean customerJoin(CustomerEntity customerEntity);

    @Select("select ifnull(max(m_uid), 0) from member where m_kind = 'C'")
    int maxCustomerUid();

    @Select("select ifnull(max(m_uid), 0) from member where m_kind = 'S'")
    int maxSellerUid();

    boolean sMemberJoin(SellerEntity sellerEntity);

    boolean sellerJoin(SellerEntity sellerEntity);

    @Select("select count(*) from member where m_id = #{mId}")
    boolean isUsedId(String mId);

    @Select("select count(*) from c_member where c_nickname = #{userNickname}")
    boolean isUsedNickname(String userNickname);

    boolean updatePw(String m_id, String ecdpw);

    ArrayList<String> getGoodsSales(char m_gender, int m_age);

    ArrayList<String> getCompanySales(int m_uid);

    String getCustomerInfo(int uid);

    String getSellerInfo(int uid);

    ArrayList<String> getSales();

    ArrayList<String> getCustomerCoupon(int uid);
}
