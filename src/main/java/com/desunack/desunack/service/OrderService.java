package com.desunack.desunack.service;

import com.desunack.desunack.dao.OrderDao;
import com.desunack.desunack.dto.MemberDto;
import com.desunack.desunack.dto.OrderDto;
import com.desunack.desunack.dto.ShoppingCartDto;
import com.desunack.desunack.entity.MemberEntity;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    private final OrderDao orderDao;

    @Transactional
    public void makeOrder(List<ShoppingCartDto> scList, Model model, HttpSession session) {
        int userUid = (int)session.getAttribute("userUid");
        int total_cost = 0;
        for (ShoppingCartDto scDto : scList) {
            int cost = orderDao.getCost(scDto.getSc_g_id());
            total_cost += (cost*scDto.getSc_qty());
        }
        MemberEntity mEntity = orderDao.getUserInfo(userUid);
        int go_num = orderDao.makeOrder(mEntity, total_cost);
        OrderDto orderDto = orderDao.getOrderInfo(go_num);
        model.addAttribute("orderDto",orderDto);

    }
}
