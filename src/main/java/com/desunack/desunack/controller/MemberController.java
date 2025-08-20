package com.desunack.security.controller;

import com.desunack.desunack.service.MemberService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping
public class MemberController {
    @Autowired
    private MemberService mSer;

    @GetMapping("/login1")
    public String login(){
        return "member/login";
    }
    @PostMapping("/login1")
    public String login1(){

    }
}
