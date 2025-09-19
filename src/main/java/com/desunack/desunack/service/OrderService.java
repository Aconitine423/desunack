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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    private final OrderDao orderDao;

    @Transactional
    public void makeOrder(List<Integer> idList, Model model, HttpSession session) {
        int userUid = (int)session.getAttribute("userUid");
        int total_cost = 0;
        for (int id : idList) {
            int cost = orderDao.getCost(id);
            int qty = orderDao.getQty(userUid, id);
            total_cost += (cost*qty);
        }
        //상품정보 불러오기
        ArrayList<String> goodsList = orderDao.getGoodsInfo(idList);
        session.setAttribute("goodsList",goodsList);
        //선택한 장바구니 불러오기
        ArrayList<String> shoppingCartList = orderDao.getShoppingCartString(userUid, idList);
        session.setAttribute("shoppingCartList",shoppingCartList);
        //유저정보 불러오기
        MemberEntity mEntity = orderDao.getUserInfo(userUid);
        //주문 초기상태 생성 후 주문번호 받아오기
        orderDao.makeOrder(mEntity, total_cost);
        log.info("mEntity={}", mEntity);
        int go_num = orderDao.getOrderNum(mEntity);
        model.addAttribute("go_num",go_num);
        //주문 초기상태 불러오기


    }

    public void loadOrder(int go_num, Model model){
        OrderEntity orderEntity = orderDao.getOrderInfo(go_num);
        log.info("oEntity={}", orderEntity);
        model.addAttribute("orderEntity",orderEntity);
    }

    @Transactional
    public void orderConfirm(List<Integer> idList, OrderEntity oEntity) {
        int god_go_num = oEntity.getGo_num();
        log.info("id:{}", god_go_num);
        int m_uid = oEntity.getGo_m_uid();
        log.info("m_uid:{}", m_uid);
        int age = (LocalDate.now().getYear() - orderDao.getAge(m_uid).getYear()) / 10 * 10;
        log.info("age:{}", age);
        char gender = orderDao.getGender(m_uid);

        orderDao.updateOrder(oEntity);
        List<ShoppingCartDto> scList = orderDao.getShoppingCart(m_uid, idList);

        orderDao.insertOrderDetail(scList, god_go_num);
        if(oEntity.getGo_payments().equals("카드")){ //payment에 들어갈 값에 따라 수정 필요
            orderDao.insertCard(oEntity);
        }
        if(oEntity.getGo_kind()==1){ // 자체배송이라면
            orderDao.insertOwn(oEntity);
        }else if(oEntity.getGo_kind()==2){ // 택배배송이라면
            orderDao.insertParcel(oEntity);
        }


        log.info("scList={}", scList);
        for(ShoppingCartDto scDto : scList){
            orderDao.updateGoods(scDto);
            orderDao.updateTotalSales(scDto);
            if(orderDao.nullCheckSales(scDto, age, gender) != 0){
                orderDao.updateSales(scDto, age, gender);
            }else{
                orderDao.insertSales(scDto, age, gender);
            }
        }
        orderDao.deleteShoppingCart(idList, oEntity.getGo_m_uid());
    }
}
