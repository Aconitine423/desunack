package com.desunack.desunack.controller;

import com.desunack.desunack.DAO.MemberDao;
import com.desunack.desunack.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;

@Slf4j
@Controller
public class HomeController {
    public MemberService mSer;
    @GetMapping("/signup")
    public String signup() {
        return "/signup/signup";
    }
    @GetMapping("/signup/customerfrm")
    public String customerJoin() {
        return "/signup/customerfrm";
    }

    @GetMapping("/member/login")
    public String login1(){
        log.info("=======login1이동");
        return "/member/login";
    }
    @GetMapping("/")
    public String home(HttpSession session) {
        Object user = session.getAttribute("m_kind");
        if (user != null){
            char kind = (char) session.getAttribute("m_kind");
            char gender = (char) session.getAttribute("m_gender");
            int age =  (LocalDate.now().getYear() - (int) session.getAttribute("m_birth"))/10 * 10; // << 현재 연도와 태어난 연도의 차를 통해서 계산하기
            if(kind == 'C'){
                if(mSer.getGoodsSales(gender, age, session)){
                    return "/";
                }
            }else if(kind == 'S'){
                int id = (int) session.getAttribute("m_id");
                if(mSer.getCompanySales(id, session)){
                    return "/";
                }
            }
        }

        return "index";
    }

}
