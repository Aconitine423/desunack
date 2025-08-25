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

    public boolean getGoodsSales(char m_gender, int m_age, HttpSession session){
        //m_age와 m_gender를 통해 상품-판매량 조인해서 검색결과 반환(JSON)한 후
        //JSON을 분해해 나온 goodsDto에 저장된 데이터를 String Builder에 저장해서 출력시킬내용 세션에 저장하기
        //조인해서 검색 결과 반환하는 쿼리문
        //select * from 상품 join 상품판매
        // on 상품ID = 상품판매ID and 상품판매성별 = 회원성별 and 상품판매나이 = 회원나이대
        //order by 상품판매량 desc;
        String Json = mDao.getGoodsSales(m_gender, m_age);
        if(Json != null){
            session.setAttribute("Json", Json);
            return true;
        }
        return false;
    }

    public boolean getCompanySales(int m_uid, HttpSession session){
        //m_uid를 통해 상품판매량 조인해서 검색결과 반환한 후
        //goodsDto에 저장된 데이터를 String Builder에 저장해서 출력시킬내용 세션에저장하기
        //쿼리문
        //select * from 상품 join 전체판매 on 상품ID = 상품판매ID
        //where 판매자ID = m_id order by 상품판매량 desc
        String Json = mDao.getCompanySales(m_uid);
        if(Json != null){
            session.setAttribute("Json", Json);
            return true;
        }
        return false;
    }
}
