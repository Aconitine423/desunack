package com.desunack.desunack.DAO;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MemberDao {

    @Select("select m_pw from member where m_id = #{m_id}")
    String getSecurityPw(String m_id);
}
