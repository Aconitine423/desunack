package com.desunack.desunack.controller;

import com.desunack.desunack.entity.MemberEntity;
import com.desunack.desunack.service.SellerService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@Slf4j
@RequiredArgsConstructor
public class SellerController {
    private final SellerService sellSer;


    @PostMapping("/seller/orderManagement")
    public String orderManagement(HttpSession session){
        MemberEntity user = (MemberEntity) session.getAttribute("member");
        boolean result = sellSer.orderList(session, user.getM_uid());
        if(result){
            return null;
        }
        return null;
    }
}
