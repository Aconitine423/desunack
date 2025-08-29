package com.desunack.desunack.service;

import com.desunack.desunack.dao.GoodsDao;
import com.desunack.desunack.dto.GoodsDto;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class GoodsService {
    private final GoodsDao goodsDao;

    @Transactional
    public boolean goodsRegistrate(GoodsDto goodsDto, HttpSession session) {
        if(goodsDao.goodsRegistrate(goodsDto, session)){
            int g_id = goodsDto.getG_id();
            if(goodsDao.goodsTotalSales(g_id)){
                if(goodsDao.goodsSweetener(g_id, goodsDto.getSList())){
                    if(goodsDto.getAList() != null) {
                        if (goodsDao.goodsAllergy(g_id, goodsDto.getAList())) {
                            return true;
                        }
                    }else{
                        return true;
                    }
                }
            }
        };

        return false;
    }
}
