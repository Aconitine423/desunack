package com.desunack.desunack.DAO;

import com.desunack.desunack.Entity.CustomerEntity;
import com.desunack.desunack.Entity.MemberEntity;
import com.desunack.desunack.Entity.SellerEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MemberDao {

    @Select("select m_pw from member where m_id = #{m_id}")
    String getSecurityPw(String m_id);

    MemberEntity getMemberEntity(String m_id);


    CustomerEntity getCustomerEntity(int m_uid);

    SellerEntity getSellerEntity(int m_uid);

    String findId(String m_name, String m_email);

    int findPw(String m_id, String m_email);

    void memberJoin(CustomerEntity customerEntity);

    boolean customerJoin(CustomerEntity customerEntity);

    @Select("select ifnull(max(m_uid),0) from member where m_kind = 'C'")
    int maxCustomerUid();

    @Select("select count(*) from member where m_id = #{mId}")
    boolean isUsedId(String mId);

    boolean updatePw(String m_id, String ecdpw);

    String getGoodsSales(char m_gender, int m_age);

    String getCompanySales(int m_uid);
}
