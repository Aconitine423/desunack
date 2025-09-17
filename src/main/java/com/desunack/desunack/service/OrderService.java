package com.desunack.desunack.service;

import com.desunack.desunack.dao.OrderDao;
import com.desunack.desunack.dto.MemberDto;
import com.desunack.desunack.dto.OrderCardDto;
import com.desunack.desunack.dto.OrderDto;
import com.desunack.desunack.dto.ShoppingCartDto;
import com.desunack.desunack.entity.MemberEntity;
import com.desunack.desunack.entity.OrderEntity;
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
        OrderEntity oEntity = orderDao.getOrderInfo(go_num).toEntity();
        model.addAttribute("orderEntity",oEntity);

    }

    @Transactional
    public void orderConfirm(List<ShoppingCartDto> scList, OrderDto oDto) {
        int god_go_num = oDto.getOrder_num();
        OrderEntity oEntity = oDto.toEntity();
        orderDao.updateOrder(oEntity);
        orderDao.insertOrderDetail(scList, god_go_num);
        if(oEntity.getGo_payments().equals("카드")){ //payment에 들어갈 값에 따라 수정 필요
            orderDao.insertCard(oEntity);
        }
        if(oEntity.getGo_kind()==1){ // 자체배송이라면
            orderDao.insertOwn(oEntity);
        }else if(oEntity.getGo_kind()==2){ // 택배배송이라면
            orderDao.insertParcel(oEntity);
        }
        orderDao.deleteShoppingCart(scList);
    }
}
