package com.desunack.desunack.service;

import com.desunack.desunack.dao.SellerDao;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@Slf4j
@RequiredArgsConstructor
public class SellerService {
    private final SellerDao sDao;


    public boolean orderList(HttpSession session, int id) {

        ArrayList<String> orderList = sDao.getOrderList(id);
        if(orderList != null){
            session.setAttribute("orderList", orderList);
            return true;
        }
        return false;
    }
}
