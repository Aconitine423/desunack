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

@Slf4j
@Controller
public class HomeController {
    public MemberService mSer;

    @GetMapping("/")
    public String home() {
        return "index";
    }
    @GetMapping("/signup")
    public String signup() {
        return "/signup/signup";
    }

    @GetMapping("/signup/customerfrm")
    public String customerJoin() {
        return "/signup/customerfrm";
    }

    @GetMapping("/")
    public String home(@RequestParam HttpSession session) {
        kind = session.getAttribute("m_kind");
        gender = session.getAttribute("m_gender");
        age = session.getAttribute("m_age") - '현재연도'; // << 현재 연도와 태어난 연도의 차를 통해서 계산하기
        if(kind == 'C'){
            if(mSer.getGoodsSales(gender, age, session)){
                return "/";
            }
        }else if(kind == 'S'){
            id = session.getAttribute("m_id");
            if(mSer.getCompanySales(id, session)){
                return "/";
            }
        }
        return "index";
    }

}
