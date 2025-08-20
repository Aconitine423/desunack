package com.desunack.desunack.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@Controller
public class HomeController {
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
}
