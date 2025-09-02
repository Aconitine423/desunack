package com.desunack.desunack.service;


import com.desunack.desunack.common.FileManager;
import com.desunack.desunack.dao.MemberDao;
import com.desunack.desunack.dto.CustomerDto;
import com.desunack.desunack.dto.SellerDto;
import com.desunack.desunack.dto.UserDto;
import com.desunack.desunack.entity.CustomerEntity;
import com.desunack.desunack.entity.MemberEntity;
import com.desunack.desunack.entity.SellerEntity;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.ui.Model;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import java.util.ArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberDao mDao;
    private UserDto uDto;
    private  CustomerDto cDto;
    private MemberEntity memberEntity;
    private final FileManager fileManager;

    // 소비자 회원가입
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

    // 판매자 회원가입
    @Transactional
    public void sellerJoin(SellerDto sellerDto, MultipartFile file) throws Exception {
        String filePath = null;
        try {
            // 파일 저장 및 경로 반환된거 받기
            filePath = fileManager.saveFile(file, "seller/");

            // 파일 경로 DTO에 저장
            sellerDto.setSellerNumImage(filePath);
            log.info("======sellerDto={}", sellerDto);
        SellerEntity sellerEntity = sellerDto.toEntity();
        if (mDao.isUsedId(sellerEntity.getM_id())){
            return ;
        }
        BCryptPasswordEncoder ecd = new BCryptPasswordEncoder();
        String ecdPw = ecd.encode(sellerEntity.getM_pw());
        sellerEntity.setM_pw(ecdPw);

        int memberUid = mDao.maxSellerUid() +1;
        sellerEntity.setM_uid(memberUid);
        boolean sMemberResult = mDao.sMemberJoin(sellerEntity);
        boolean sellerResult = mDao.sellerJoin(sellerEntity);
        if (!(sMemberResult && sellerResult)) {
            // DB 저장 실패 시 강제로 예외를 발생시켜 트랜잭션 롤백
            throw new Exception("회원가입 데이터 저장 실패");
        }
        } catch (IOException e) {
            // 파일 업로드 실패시 에러처리하면서 파일 삭제
            if (filePath != null) {
                fileManager.deleteFile(filePath, "seller/");
            }
            throw e;
        } catch (Exception e) {
            if (filePath != null) {
                fileManager.deleteFile(filePath, "seller/");
            }
            throw e;
        }

    }


    // 회원가입 아이디 중복체크
    public boolean isUsedId(String userId) {
        return mDao.isUsedId(userId);
    }

    // 회원가입 닉네임 중복체크
    public boolean isUsedNickname(String userNickname) {
        return mDao.isUsedNickname(userNickname);
    }

    public boolean login1(String id, String pw, Model model, HttpSession session){
        String ecdpw = mDao.getSecurityPw(id);
        if(ecdpw != null){
            log.info("========id ok========");
            BCryptPasswordEncoder ecd = new BCryptPasswordEncoder();
            if(ecd.matches(pw,ecdpw)){
                log.info("========success=======");
                memberEntity = mDao.getMemberEntity(id);
                switch(memberEntity.getM_kind()){
                    case 'A':
                        model.addAttribute("member",memberEntity);
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
                log.info(session.getAttribute("member").toString());
                return true;
            }
            return false;
        }
        return false;
    }

    // 아이디 찾기
    public Map<String, Object> findId(UserDto userDto) {
        Map<String, Object> response =  new HashMap<>();
        MemberEntity memberEntity = userDto.toEntity();
        String name = memberEntity.getM_name();
        String email = memberEntity.getM_email();
        String findId = mDao.findId(name, email);
        if (findId != null) {
            response.put("result", true);
            response.put("data", findId);
        } else {
            response.put("result", false);
            response.put("msg", "일치하는 회원 정보가 없습니다.");
        }
        return response;
    }

    // 비밀번호 찾기
    public Map<String, Object> findPw(UserDto userDto) {
        Map<String, Object> response =  new HashMap<>();
        MemberEntity memberEntity = userDto.toEntity();
        String id =  memberEntity.getM_id();
        String email = memberEntity.getM_email();
        int findPw = mDao.findPw(id, email);
        if(findPw != 0){
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
            if(mDao.updatePw(id, ecdpw)){
                response.put("result", true);
                response.put("data", pw);
            } else{
                response.put("result", false);
                response.put("msg", "비밀번호 변경에 실패하였습니다.");
            }
            return response;
        } else {
            response.put("result", false);
            response.put("msg", "일치하는 회원정보가 없습니다.");
        }
        return response;
    }

    public boolean getGoodsSales(char m_gender, int m_age, HttpSession session){
        //m_age와 m_gender를 통해 상품-판매량 조인해서 검색결과 반환(JSON)한 후
        //JSON을 분해해 나온 goodsDto에 저장된 데이터를 String Builder에 저장해서 출력시킬내용 세션에 저장하기
        //조인해서 검색 결과 반환하는 쿼리문
        //select * from 상품 join 상품판매
        // on 상품ID = 상품판매ID and 상품판매성별 = 회원성별 and 상품판매나이 = 회원나이대
        //order by 상품판매량 desc;
        ArrayList<String> Json = mDao.getGoodsSales(m_gender, m_age);
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
        ArrayList<String> Json = mDao.getCompanySales(m_uid);
        if(Json != null){
            session.setAttribute("Json", Json);
            return true;
        }
        return false;
    }

    public boolean getCustomerInfo(int uid, HttpSession session) {
        String Json = mDao.getCustomerInfo(uid);
        ArrayList<String> cList = mDao.getCustomerCoupon(uid);
        if(Json != null){
            if(cList != null){
                session.setAttribute("cList", cList);
            }
            session.setAttribute("Json", Json);
            return true;
        }
        return false;
    }

    public boolean getSellerInfo(int uid, HttpSession session) {
        String Json = mDao.getSellerInfo(uid);
        if(Json != null){
            session.setAttribute("Json", Json);
            return true;
        }
        return false;
    }

    public boolean getSales(HttpSession session) {
        ArrayList<String> Json = mDao.getSales();
        if(Json != null){
            session.setAttribute("Json", Json);

            return true;
        }
        return false;
    }

    public UserDto login(UserDto userDto) {
        log.info("======userDto={}",  userDto);
        String pw = userDto.getUserPw();
        MemberEntity memberEntity = userDto.toEntity();
        BCryptPasswordEncoder ecd = new BCryptPasswordEncoder();
        String id = memberEntity.getM_id();
        String securityPw = mDao.getSecurityPw(id);
        log.info("======securityPw={}",securityPw);
        if (ecd.matches(pw, securityPw)) {
            memberEntity = mDao.getMemberEntity(id);
            return memberEntity.toDto();
        }
        return null;
    }
}
