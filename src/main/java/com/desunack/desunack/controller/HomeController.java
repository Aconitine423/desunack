package com.desunack.desunack.controller;

import com.desunack.desunack.dto.CustomerDto;
import com.desunack.desunack.dto.SellerDto;
import com.desunack.desunack.dto.UserDto;
import com.desunack.desunack.entity.CustomerEntity;
import com.desunack.desunack.entity.MemberEntity;
import com.desunack.desunack.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;

@Slf4j
@Controller
@RequiredArgsConstructor
public class HomeController {
    private final MemberService mSer;

    @GetMapping("/signup")
    public String signup() {
        return "/signup/signup";
    }

    @GetMapping("/signup/customerfrm")
    public String customerJoin() {
        return "/signup/customerFrm";
    }

    @GetMapping("/signup/sellerfrm")
    public String sellerJoin() {
        return "/signup/sellerFrm";
    }

    @GetMapping("/login")
    public String login1() {
        log.info("=======login1이동");
        return "/member/login";
    }

    @GetMapping("/")
    public String home(HttpSession session, Model model) {
        if(session.getAttribute("m_kind") != null) {
            mSer.getSales(session);
            String kind = session.getAttribute("m_kind").toString();
            log.info("=======kind={}", kind);
            if (kind != null) {
                if (kind.equals("C")) {
                    int customerUid = (int) session.getAttribute("userUid");
                    boolean result = mSer.getUserInfo(customerUid, model);
                    if (result) {
                        CustomerDto cDto = (CustomerDto) model.getAttribute("customerDto");
                        if (cDto != null) {
                            int age = (LocalDate.now().getYear() - cDto.getCustomerBDay().getYear()) / 10 * 10; // << 현재 연도와 태어난 연도의 차를 통해서 계산하기
                            model.addAttribute("age", age);
                            char gender = cDto.getCustomerGender();
                            String cGender = "";
                            if(gender == '1'){
                                cGender = "남성";
                            }else if(gender == '2'){
                                cGender = "여성";
                            }
                            model.addAttribute("gender", cGender);
                            if (mSer.getGoodsSales(gender, age, session)) {
                                log.info(session.getAttribute("gList").toString());
                                return "index";
                            }
                        }
                    }
                } else if (kind.equals("S")) {
                    int sellerUid = (int) session.getAttribute("userUid");
                    boolean result = mSer.getUserInfo(sellerUid, model);
                    if (result) {
                        SellerDto sDto = (SellerDto) model.getAttribute("sellerDto");
                        if (sDto != null) {
                            if (mSer.getCompanySales(sellerUid, session)) {
                                log.info(session.getAttribute("gList").toString());
                                return "index";
                            }
                        }
                    }
                } else { // 'A' 관리자일때
                    if (mSer.getSales(session)) {
                        log.info(session.getAttribute("gList").toString());
                        return "index";
                    }
                }
            }
        }
        if (mSer.getSales(session)) { // 비로그인
            return "index";
        }
        return "index";
    }

}
