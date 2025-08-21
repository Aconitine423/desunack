package com.desunack.desunack.service;


import com.desunack.desunack.DAO.MemberDao;
import com.desunack.desunack.DTO.CustomerDto;
import com.desunack.desunack.DTO.SellerDto;
import com.desunack.desunack.DTO.UserDto;
import com.desunack.desunack.Entity.CustomerEntity;
import com.desunack.desunack.Entity.MemberEntity;
import com.desunack.desunack.Entity.SellerEntity;
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
                switch(memberEntity.getM_kind()){
                    case 'A':
                        break;
                    case 'C':
                        CustomerEntity cEntity = mDao.getCustomerEntity(memberEntity.getM_uid());
                        CustomerDto cDto = new CustomerDto();
                        cDto = cEntity.toDto(memberEntity);

                        break;
                    case 'S':
                        SellerEntity sEntity = mDao.getSellerEntity(memberEntity.getM_uid());
                        SellerDto sDto = new SellerDto();
                        sDto = sEntity.toDto(memberEntity);
                        break;
                }
                return uDto;
            }
        }
        return null;
    }
}
