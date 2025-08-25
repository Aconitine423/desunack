package com.desunack.desunack.controller;

import com.desunack.desunack.DTO.CustomerDto;
import com.desunack.desunack.DTO.UserDto;
import com.desunack.desunack.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@RequiredArgsConstructor
@Controller
@Slf4j
@RequestMapping
public class MemberController {
    private final MemberService mSer;

    @PostMapping("/signup/customerJoin")
    public ResponseEntity<String> joinCustomer(@RequestBody CustomerDto customerDto){
        log.info("======customerDto={}", customerDto);
        boolean result = mSer.customerJoin(customerDto);
        if(result){
            return ResponseEntity.ok("회원가입 성공");
        } else {
            return ResponseEntity.badRequest().body("회원가입 실패");
        }
    }

    @GetMapping("/member/login")
    public String login(){
        return "/member/login";
    }
    @PostMapping("/member/login")
    public String login1(@RequestParam UserDto userDto, Model model, HttpSession session, RedirectAttributes rttr){

        if(mSer.login1(userDto.getUserId(), userDto.getUserPw(), session)){
            log.info("======로그인");
            return null;
//            return "redirect:/";
        }
        log.info("======로그인실패");
        rttr.addFlashAttribute("msg","로그인에 실패했습니다. 아이디 혹은 비밀번호를 확인해주세요");
return null;
//        return "redirect:/";
    }
}
