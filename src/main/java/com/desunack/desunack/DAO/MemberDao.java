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

    MemberEntity getMemberEntity(String userId);


    CustomerEntity getCustomerEntity(int m_Uid);

    SellerEntity getSellerEntity(int mUid);

    void memberJoin(CustomerEntity customerEntity);

    boolean customerJoin(CustomerEntity customerEntity);

    @Select("select max(m_uid) from member where m_kind = 'C'")
    int maxCustomerUid();
}
