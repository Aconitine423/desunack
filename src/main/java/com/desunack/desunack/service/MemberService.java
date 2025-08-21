package com.desunack.desunack.service;


import com.desunack.desunack.DAO.MemberDao;
import com.desunack.desunack.DTO.UserDto;
import com.desunack.desunack.Entity.MemberEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MemberService {
    @Autowired
    private MemberDao mDao;
    private UserDto uDto;
    private MemberEntity memberEntity;

    public UserDto login1(String id, String pw){
        String ecdpw = mDao.getSecurityPw(id);
        if(ecdpw != null){
            log.info("========id ok========");
            BCryptPasswordEncoder ecd = new BCryptPasswordEncoder();
            if(ecd.matches(pw,ecdpw)){
                log.info("========success=======");
                memberEntity = mDao.getMemberEntity(id);

//                uDto = member.toDto();
                return uDto;
            }
        }
        return null;
    }
}
