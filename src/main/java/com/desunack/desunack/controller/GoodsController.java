package com.desunack.desunack.controller;

import com.desunack.desunack.dto.GoodsDto;
import com.desunack.desunack.service.GoodsService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@Slf4j
@RequiredArgsConstructor
public class GoodsController {
    private final GoodsService gSer;


    @PostMapping("/goods/registrate")
    public String goodsRegistrate(@RequestBody GoodsDto goodsDto, HttpSession session) {
        boolean result = gSer.goodsRegistrate(goodsDto, session);
        if(result){
            return null;
        }
        return null;
    }
}
