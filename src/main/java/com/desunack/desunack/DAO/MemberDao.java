package com.desunack.desunack.DAO;

import com.desunack.desunack.Entity.MemberEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MemberDao {

    @Select("select m_pw from member where m_id = #{m_id}")
    String getSecurityPw(String m_id);

    MemberEntity getMemberEntity(String userId);
}
