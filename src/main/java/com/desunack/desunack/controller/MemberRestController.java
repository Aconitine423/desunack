package com.desunack.desunack.controller;

import com.desunack.desunack.dto.UserDto;
import com.desunack.desunack.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.Member;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MemberRestController {
    private final MemberService mSer;

    @PostMapping("/member/find-id")
    public Map<String, Object> findId(@RequestBody UserDto userDto) {
        Map<String, Object> response = mSer.findId(userDto);
        return response;
    }

    @PostMapping("/member/find-pw")
    public Map<String, Object> findPw(@RequestBody UserDto userDto) {
        Map<String, Object> response = mSer.findPw(userDto);
        return response;
    }

    // 엑시오스 로그인
    @PostMapping("/member/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto, HttpSession session) {
        try {
            log.info("======login시도={}", userDto);
            UserDto uDto = mSer.login(userDto);
            if (uDto != null) {
                session.setAttribute("m_kind", uDto.getUserKind());
                session.setAttribute("userUid", uDto.getUserUid());
                session.setAttribute("userName", uDto.getUserName());
                return ResponseEntity.ok().body(Map.of("success", true, "message", "로그인 성공"));
            } else {
                return ResponseEntity.ok().body(Map.of("success", false, "message", "아이디 또는 비밀번호가 올바르지 않습니다."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "message", "로그인 중 오류가 발생했습니다."));
        }
    }
}
