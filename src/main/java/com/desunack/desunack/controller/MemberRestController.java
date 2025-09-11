package com.desunack.desunack.controller;

import com.desunack.desunack.dto.CustomerDto;
import com.desunack.desunack.dto.UserDto;
import com.desunack.desunack.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class MemberRestController {
    private final MemberService mSer;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/find/id")
    public Map<String, Object> findId(@RequestBody UserDto userDto) {
        return mSer.findId(userDto);
    }

    @PostMapping("/find/pw")
    public Map<String, Object> findPw(@RequestBody UserDto userDto) {
        return mSer.findPw(userDto);
    }

    // 엑시오스 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto, HttpSession session) {
        try {
            log.info("======login시도={}", userDto);
            UserDto uDto = mSer.login(userDto);
            if (uDto != null) {
                log.info("======uDto={}", uDto);
                // 1. AuthenticationManager에게 인증 요청
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(uDto.getUserId(), userDto.getUserPw())
                );

                // 2. 인증 성공 시, SecurityContextHolder에 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("======authentication={}", authentication);

                session.setAttribute("m_kind", uDto.getUserKind());
                session.setAttribute("userUid", uDto.getUserUid());
                session.setAttribute("userName", uDto.getUserName());
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "로그인 성공");
//                response.put("m_kind", uDto.getUserKind());
                return ResponseEntity.ok().body(response);
            } else {
                return ResponseEntity.ok().body(Map.of("success", false, "message", "아이디 또는 비밀번호가 올바르지 않습니다."));
            }
        } catch (AuthenticationException e) {
            log.warn("로그인 실패: {}", e.getMessage());
            return ResponseEntity.ok().body(Map.of("success", false, "message", "아이디 또는 비밀번호가 올바르지 않습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "message", "로그인 중 오류가 발생했습니다."));
        }
    }

    // 소비자 회원정보 수정
    @PostMapping("/member/customerUpdate")
    public ResponseEntity<String> customerUpdate(@RequestBody CustomerDto cDto, HttpSession session) {
        log.info("======cDto={}", cDto);
        boolean result = mSer.customerUpdate(cDto, session);
        if (result) {
            return ResponseEntity.ok("회원정보 수정 성공");
        } else {
            return ResponseEntity.badRequest().body("회원정보 수정 실패");
        }
    }
}
