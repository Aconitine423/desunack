package com.desunack.desunack.controller;

import com.desunack.desunack.dto.ShoppingCartDto;
import com.desunack.desunack.service.OrderService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;


@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping
public class OrderController {
    OrderService oSer;

    @PostMapping("/goods/order")
    public ResponseEntity<String> goodsOrder(@RequestBody List<ShoppingCartDto> scList, Model model, HttpSession session){
        try{
            oSer.makeOrder(scList, model, session);
            model.addAttribute("scList",scList);
            return ResponseEntity.ok("페이지 이동 성공");
        }catch(Exception e){
            log.error("페이지 이동중 에러 발생", e);
            return ResponseEntity.badRequest().body("페이지 이동 실패");

        }
    }

    @GetMapping("/goods/order")
    public String goodsOrder(){
        return "/goods/order";
    }
}
