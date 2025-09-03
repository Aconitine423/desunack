package com.desunack.desunack.controller;

import com.desunack.desunack.entity.CustomerEntity;
import com.desunack.desunack.entity.MemberEntity;
import com.desunack.desunack.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
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

    @GetMapping("/member/login")
    public String login1() {
        log.info("=======login1이동");
        return "/member/login";
    }

    @GetMapping("/")
    public String home(HttpSession session) {
        MemberEntity user = (MemberEntity) session.getAttribute("member");
        log.info("=======user={}", user);
        if (user != null){
            char kind = user.getM_kind();
            log.info("=======kind={}", kind);


            if(kind == 'C'){
                CustomerEntity customer = (CustomerEntity) session.getAttribute("member");
                int age =  (LocalDate.now().getYear() - (int) session.getAttribute("m_birth"))/10 * 10; // << 현재 연도와 태어난 연도의 차를 통해서 계산하기
                char gender = customer.getC_gender();
                if(mSer.getGoodsSales(gender, age, session)){
                    log.info(session.getAttribute("gList").toString());
                    return "redirect:/";
                }
            }else if(kind == 'S'){
                int id = user.getM_uid();
                if(mSer.getCompanySales(id, session)){
                    log.info(session.getAttribute("gList").toString());
                    return "redirect:/";
                }
            }else{
                if(mSer.getSales(session)){
                    log.info(session.getAttribute("gList").toString());
                    return "redirect:/";
                }
            }
        }
        if(mSer.getSales(session)){
            log.info(session.getAttribute("gList").toString());
            return "index";
        }
        return "index";
    }

}
