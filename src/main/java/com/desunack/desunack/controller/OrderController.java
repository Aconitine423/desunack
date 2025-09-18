package com.desunack.desunack.controller;

import com.desunack.desunack.dto.*;
import com.desunack.desunack.entity.OrderEntity;
import com.desunack.desunack.service.OrderService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping
public class OrderController {
    private final OrderService oSer;

    @PostMapping("/order/order")
    public ResponseEntity<String> goodsOrder(@RequestBody List<Integer> idList, Model model, HttpSession session){
        try{
            log.info(idList.toString());
            oSer.makeOrder(idList, model, session);
            return ResponseEntity.ok(model.getAttribute("go_num").toString());
        }catch(Exception e){
            log.error("페이지 이동중 에러 발생", e);
            return ResponseEntity.badRequest().body("페이지 이동 실패");

        }
    }

    @PostMapping("/order/orderUpdate")
    public ResponseEntity<String> goodsOrderUpdate(@RequestPart List<Integer> idList, @RequestPart OrderEntity OrderEntity){
        try{
            oSer.orderConfirm(idList, OrderEntity);
            return ResponseEntity.ok("주문 성공");
        }
        catch(Exception e){
            log.error("주문 처리 중 에러 발생", e);
            return ResponseEntity.badRequest().body("주문 실패");
        }
    }

    @GetMapping("/order/order/{go_num}")
    public String goodsOrder(@PathVariable("go_num")int go_num, Model model){
        oSer.loadOrder(go_num, model);
        return "/order/order";
    }
}
