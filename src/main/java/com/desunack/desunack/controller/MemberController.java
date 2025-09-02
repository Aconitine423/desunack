package com.desunack.desunack.controller;

import com.desunack.desunack.common.FileManager;
import com.desunack.desunack.dto.CustomerDto;
import com.desunack.desunack.dto.SellerDto;
import com.desunack.desunack.dto.UserDto;
import com.desunack.desunack.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Controller
@Slf4j
@RequestMapping
public class MemberController {
    private final MemberService mSer;

    // 소비자 회원가입
    @PostMapping("/signup/customerJoin")
    public ResponseEntity<String> joinCustomer(@RequestBody CustomerDto customerDto) {
        log.info("======customerDto={}", customerDto);
        boolean result = mSer.customerJoin(customerDto);
        if (result) {
            return ResponseEntity.ok("회원가입 성공");
        } else {
            return ResponseEntity.badRequest().body("회원가입 실패");
        }
    }

    // 판매자 회원가입
    @PostMapping("/signup/sellerJoin")
    public ResponseEntity<String> joinSeller(@RequestPart("sellerDto") SellerDto sellerDto, @RequestPart("file") MultipartFile file) {
        log.info("요청 진입: {}", sellerDto);
        try {
            mSer.sellerJoin(sellerDto, file);
            return ResponseEntity.ok("회원가입 성공");
        } catch (IOException e) {
            log.error("파일 업로드 중 에러 발생", e);
            return ResponseEntity.status(500).body("파일 업로드 실패");
        } catch (Exception e) {
            log.error("회원가입 처리 중 에러 발생", e);
            return ResponseEntity.badRequest().body("회원가입 실패");
        }
    }

    // 회원가입 아이디 중복체크
    @PostMapping("/signup/checkUserId")
    public ResponseEntity<Boolean> checkUserId(@RequestBody UserDto userDto) {
        String userId = userDto.getUserId();
        boolean isUsedId = mSer.isUsedId(userId); // true면 중복
        return ResponseEntity.ok(isUsedId);
    }

    // 회원가입 닉네임 중복체크
    @PostMapping("/signup/checkUserNickname")
    public ResponseEntity<Boolean> checkUserNickname(@RequestBody CustomerDto customerDto) {
        String userNickname = customerDto.getCustomerNickname();
        boolean isUsedNickname = mSer.isUsedNickname(userNickname); // true면 중복
        return ResponseEntity.ok(isUsedNickname);
    }

    //로그인
//    @PostMapping("/member/login")
//    public String login1(@RequestParam String id, String pw, Model model, HttpSession session, RedirectAttributes rttr) {
//
//        if (mSer.login1(id, pw, model, session)) {
//            log.info("======login success={}", id);
//            return "redirect:/";
//        }
//        log.info("======login fail={}", id);
//        rttr.addFlashAttribute("msg", "로그인에 실패했습니다. 아이디 혹은 비밀번호를 확인해주세요");
//
//        return null;
//    }

    @PostMapping("/member/mypage")
    public String getCustomerInfo(@RequestBody UserDto uDto, HttpSession session) {
        if (uDto.getUserKind() == 'C') {
            if (mSer.getCustomerInfo(uDto.getUserUid(), session)) {
                return null;
            }
        } else if (uDto.getUserKind() == 'S') {
            if (mSer.getSellerInfo(uDto.getUserUid(), session)) {
                return null;
            }
        }
        return null;
    }



//    @PostMapping("/member/find-pw")
//    public String findPw(@RequestParam UserDto userDto, Model model, HttpSession session, RedirectAttributes rttr) {
//        if (mSer.findPw(userDto.getUserId(), userDto.getUserEmail(), rttr)) {
//            return "/";
//        }
//        rttr.addFlashAttribute("msg", "일치하는 결과가 없습니다");
//        return "/";
//    }
}
