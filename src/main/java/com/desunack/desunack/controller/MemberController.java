package com.desunack.desunack.controller;

import com.desunack.desunack.DTO.UserDto;
import com.desunack.desunack.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
    public String login1(@RequestParam UserDto userDto, HttpSession session, RedirectAttributes rttr){

        if(mSer.login1(userDto.getUserId(), userDto.getUserPw(), session)){
            return "redirect:/";
        }
        rttr.addFlashAttribute("msg","로그인에 실패했습니다. 아이디 혹은 비밀번호를 확인해주세요");

        return "redirect:/";
    }
    @PostMapping("/find-id")
    public String findId(@RequestParam UserDto userDto, Model model, HttpSession session, RedirectAttributes rttr){
        if(mSer.findId(userDto.getUserName(),userDto.getUserEmail(), rttr)){
            return "/";
        }
        rttr.addFlashAttribute("msg", "일치하는 결과가 없습니다.");
        return "/";
    }

    @PostMapping("/find-pw")
    public String findPw(@RequestParam UserDto userDto, Model model, HttpSession session, RedirectAttributes rttr){
        if(mSer.findPw(userDto.getUserId(),userDto.getUserEmail(),rttr)){
            return "/";
        }
        rttr.addFlashAttribute("msg", "일치하는 결과가 없습니다");
        return "/";
    }
}
