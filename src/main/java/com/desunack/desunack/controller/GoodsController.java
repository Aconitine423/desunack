package com.desunack.desunack.controller;

import com.desunack.desunack.dto.GoodsDto;
import com.desunack.desunack.service.GoodsService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping
public class GoodsController {
    private final GoodsService gSer;


    @GetMapping("/goods/registrate")
    public String gRegistrate(){
        log.info("=====등록 페이지 이동");
        return "/Registration";
    }
    @PostMapping("/goods/registrate")
    public ResponseEntity<String> goodsRegistrate(@RequestPart("goodsDto") GoodsDto goodsDto,
                                                  @RequestPart("mainFile")MultipartFile main,
                                                  @RequestPart("subFile")MultipartFile sub,
                                                  HttpSession session) {
        log.info("=====상품등록 시도");
        log.info("=========={}", goodsDto);
        try {
            gSer.goodsRegistrate(goodsDto, main, sub,
                    session);
            return ResponseEntity.ok("상품등록 성공");
        } catch (IOException e) {
            log.error("파일 업로드 중 에러 발생", e);
            return ResponseEntity.status(500).body("파일 업로드 실패");
        } catch (Exception e) {
            log.error("회원가입 처리 중 에러 발생", e);
            return ResponseEntity.badRequest().body("상품등록 실패");
        }
    }
}
