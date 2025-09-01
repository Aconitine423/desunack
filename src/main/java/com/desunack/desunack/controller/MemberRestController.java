package com.desunack.desunack.controller;

import com.desunack.desunack.dto.UserDto;
import com.desunack.desunack.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
}
