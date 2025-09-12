package com.desunack.desunack.controller;

import com.desunack.desunack.dto.GoodsDto;
import com.desunack.desunack.dto.GoodsInfoDto;
import com.desunack.desunack.dto.TransferAllergyDto;
import com.desunack.desunack.dto.TransferSweetenerDto;
import com.desunack.desunack.service.GoodsService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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
                                                  @RequestPart("tAllergy") TransferAllergyDto taDTO,
                                                  @RequestPart("tSweetener") TransferSweetenerDto tsDTO,
                                                  @RequestPart("goodsInfoDto") GoodsInfoDto giDTO,
                                                  HttpSession session) {
        log.info("=====상품등록 시도");
        log.info("=========={}", goodsDto);
        log.info("=========={}", giDTO);
        try {
            gSer.goodsRegistrate(goodsDto, main, sub, taDTO, tsDTO,
                    giDTO,session);
            return ResponseEntity.ok("상품등록 성공");
        } catch (IOException e) {
            log.error("파일 업로드 중 에러 발생", e);
            return ResponseEntity.status(500).body("파일 업로드 실패");
        } catch (Exception e) {
            log.error("상품등록 처리 중 에러 발생", e);
            return ResponseEntity.badRequest().body("상품등록 실패");
        }
    }
    @GetMapping("/goods/detail/{g_id}")
    public String goodsDetail(@PathVariable("g_id") int g_id, Model model){
        if(gSer.getGoodsDetail(g_id, model)){
            return "/goods/goodsDetail";
        }
        log.info("상품 정보를 불러오는 것을 실패했습니다.");
        return null;
    }

    @PostMapping("/goods/favorite")
    public ResponseEntity<String> goodsFavorite(@RequestPart int g_id, @RequestPart int userUid){
        try {
            gSer.insertFavorite(g_id,userUid);
            return ResponseEntity.ok("찜목록 등록 성공");
        } catch (Exception e) {
            log.error("찜 목록 등록 중 에러 발생", e);
            return ResponseEntity.badRequest().body("찜목록 등록 실패");
        }
    }

    @PostMapping("/goods/shoppingCart")
    public ResponseEntity<String> goodsShoppingCart(@RequestPart int g_id, @RequestPart int userUid, @RequestPart int qty){
        try {
            gSer.insertCart(g_id,userUid, qty);
            return ResponseEntity.ok("장바구니 등록 성공");
        } catch (Exception e) {
            log.error("찜 목록 등록 중 에러 발생", e);
            return ResponseEntity.badRequest().body("장바구니 등록 실패");
        }
    }
}
