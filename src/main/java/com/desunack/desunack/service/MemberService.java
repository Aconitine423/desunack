package com.desunack.desunack.service;


import com.desunack.desunack.DAO.MemberDao;
import com.desunack.desunack.DTO.CustomerDto;
import com.desunack.desunack.DTO.SellerDto;
import com.desunack.desunack.DTO.UserDto;
import com.desunack.desunack.Entity.CustomerEntity;
import com.desunack.desunack.Entity.MemberEntity;
import com.desunack.desunack.Entity.SellerEntity;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberDao mDao;
    private UserDto uDto;
    private  CustomerDto cDto;
    private MemberEntity memberEntity;

    @Transactional
    public boolean customerJoin(CustomerDto customerDto) {
        // DTO -> Entity 변환
        CustomerEntity customerEntity = customerDto.toEntity();

        // ID 중복체크
        if (mDao.isUsedId(customerEntity.getM_id())){
            return false;
        }

        // 비밀번호 암호화
        BCryptPasswordEncoder ecd = new BCryptPasswordEncoder();
        String ecdPw = ecd.encode(customerEntity.getM_pw());
        customerEntity.setM_pw(ecdPw);

        // 회원고유번호 조회해서 +1
        int memberUid = mDao.maxCustomerUid() +1;
        customerEntity.setM_uid(memberUid);

        // 공통테이블 먼저 insert
        mDao.memberJoin(customerEntity);

        // 소비자테이블 insert
        mDao.customerJoin(customerEntity);

        return true;
    }

    public boolean login1(String id, String pw, HttpSession session){
        String ecdpw = mDao.getSecurityPw(id);
        if(ecdpw != null){
            log.info("========id ok========");
            BCryptPasswordEncoder ecd = new BCryptPasswordEncoder();
            if(ecd.matches(pw,ecdpw)){
                log.info("========success=======");
                memberEntity = mDao.getMemberEntity(id);
                switch(memberEntity.getM_kind()){
                    case 'A':
                        session.setAttribute("member", memberEntity);

                        break;
                    case 'C':
                        CustomerEntity cEntity = mDao.getCustomerEntity(memberEntity.getM_uid());
                        CustomerDto cDto = cEntity.toDto();
                        session.setAttribute("member", cDto);
                        break;
                    case 'S':
                        SellerEntity sEntity = mDao.getSellerEntity(memberEntity.getM_uid());
                        SellerDto sDto = sEntity.toDto();
                        session.setAttribute("member", sDto);
                        break;
                }
                return true;
            }
            return false;
        }
        return false;
    }

}
