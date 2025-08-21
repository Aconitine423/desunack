package com.desunack.desunack.service;


import com.desunack.desunack.DAO.MemberDao;
import com.desunack.desunack.DTO.CustomerDto;
import com.desunack.desunack.DTO.SellerDto;
import com.desunack.desunack.DTO.UserDto;
import com.desunack.desunack.Entity.CustomerEntity;
import com.desunack.desunack.Entity.MemberEntity;
import com.desunack.desunack.Entity.SellerEntity;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Slf4j
@Service
public class MemberService {
    @Autowired
    private MemberDao mDao;
    private UserDto uDto;
    private MemberEntity memberEntity;

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
                        CustomerDto cDto = cEntity.toDto(memberEntity);
                        session.setAttribute("member", cDto);
                        break;
                    case 'S':
                        SellerEntity sEntity = mDao.getSellerEntity(memberEntity.getM_uid());
                        SellerDto sDto = sEntity.toDto(memberEntity);
                        session.setAttribute("member", sDto);
                        break;
                }
                return true;
            }
            return false;
        }
        return false;
    }

    public boolean findId(String m_name, String m_email, RedirectAttributes rttr) {
        String id = mDao.findId(m_name, m_email);
        if(id != null){
            String msg = m_name + "님의 ID는 " + id + "입니다";
            rttr.addFlashAttribute("msg", msg);
            return true;
        }
        return false;
    }


    public boolean findPw(String m_id, String m_email, RedirectAttributes rttr) {
        int isExist = mDao.findPw(m_id, m_email);
        if(isExist != 0){
            StringBuilder sb = new StringBuilder();
            int randNum;
            char randChar;
            for(int i = 0; i < 12; i++){
                randNum = (int)(Math.random() * 1000);
                randNum = randNum % 62;
                if(randNum > 9 && randNum < 36){
                    randChar = (char) (randNum + 87);
                    sb.append(randChar);
                }else if(randNum > 35){
                    randChar = (char) (randNum + 28);
                    sb.append(randChar);
                }
                else{
                    sb.append(randNum);
                }
            }
            BCryptPasswordEncoder ecd = new BCryptPasswordEncoder();
            String pw = sb.toString();
            String ecdpw = ecd.encode(pw);
            if(mDao.updatePw(m_id, ecdpw)){
                String msg = m_id + "님의 임시 비밀번호는 " + pw + "입니다";
                rttr.addFlashAttribute("msg", msg);
            }else{
                String msg = "서버와의 연결이 원활하지 않습니다.";
                rttr.addFlashAttribute("msg", msg);
            }
            return true;
        }
        return false;
    }
}
