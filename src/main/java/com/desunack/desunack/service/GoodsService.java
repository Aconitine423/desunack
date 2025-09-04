package com.desunack.desunack.service;

import com.desunack.desunack.common.FileManager;
import com.desunack.desunack.dao.GoodsDao;
import com.desunack.desunack.dto.GoodsDto;
import com.desunack.desunack.dto.GoodsInfoDto;
import com.desunack.desunack.dto.TransferAllergyDto;
import com.desunack.desunack.dto.TransferSweetenerDto;
import com.desunack.desunack.entity.SellerEntity;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;

@Service
@Slf4j
@RequiredArgsConstructor
public class GoodsService {
    private final GoodsDao goodsDao;
    private final FileManager fileManager;

    public ArrayList<Integer> getAList(TransferAllergyDto taDTO){
        ArrayList<Integer> aList = new ArrayList<>();
        if(taDTO.isAllergy1()){
            aList.add(1);
        }
        if(taDTO.isAllergy2()){
            aList.add(2);
        }
        if(taDTO.isAllergy3()){
            aList.add(3);
        }
        if(taDTO.isAllergy4()){
            aList.add(4);
        }
        if(taDTO.isAllergy5()){
            aList.add(5);
        }
        if(taDTO.isAllergy6()){
            aList.add(6);
        }
        if(taDTO.isAllergy7()){
            aList.add(7);
        }
        if(taDTO.isAllergy8()){
            aList.add(8);
        }
        return aList;
    }

    public ArrayList<Integer> getSList(TransferSweetenerDto tsDto){
        ArrayList<Integer> sList = new ArrayList<>();
        if(tsDto.isSweetener1()){
            sList.add(1);
        }
        if(tsDto.isSweetener2()){
            sList.add(2);
        }
        if(tsDto.isSweetener3()){
            sList.add(3);
        }
        if(tsDto.isSweetener4()){
            sList.add(4);
        }
        if(tsDto.isSweetener5()){
            sList.add(5);
        }
        if(tsDto.isSweetener6()){
            sList.add(6);
        }
        if(tsDto.isSweetener7()){
            sList.add(7);
        }
        if(tsDto.isSweetener8()){
            sList.add(8);
        }
        if(tsDto.isSweetener9()){
            sList.add(9);
        }
        if(tsDto.isSweetener10()){
            sList.add(10);
        }
        return sList;
    }
    @Transactional
    public void goodsRegistrate(GoodsDto goodsDto, MultipartFile main, MultipartFile sub, TransferAllergyDto taDTO, TransferSweetenerDto tsDto,
                                GoodsInfoDto giDto, HttpSession session)
            throws Exception {
        String mainPath = null;
        String subPath = null;
        ArrayList<Integer> aList = getAList(taDTO);
        ArrayList<Integer> sList = getSList(tsDto);


        try {
            // 파일 저장 및 경로 반환된거 받기
            mainPath = fileManager.saveFile(main, "goods/");
            subPath = fileManager.saveFile(sub, "goods/");
            // 파일 경로 DTO에 저장
            goodsDto.setG_image(mainPath);
            goodsDto.setG_detail(subPath);
            log.info("======sellerDto={}", goodsDto);

            if (goodsDao.goodsRegistrate(goodsDto)) {
                int g_id = goodsDto.getG_id();
                if (goodsDao.goodsTotalSales(g_id)) {
                    if(goodsDao.goodsInfo(g_id,giDto)) {
                        if (goodsDao.goodsSweetener(g_id, sList)) {
                            if (aList != null) {
                                if (goodsDao.goodsAllergy(g_id, aList)) {

                                }
                            } else {

                            }
                        }
                    }
                }
            }
            ;


        } catch (IOException e) {
            // 파일 업로드 실패시 에러처리하면서 파일 삭제
            if (mainPath != null) {
                fileManager.deleteFile(mainPath, "goods/");
            }
            if (subPath != null) {
                fileManager.deleteFile(subPath, "goods/");
            }
            throw e;
        } catch (Exception e) {
            if (mainPath != null) {
                fileManager.deleteFile(mainPath, "goods/");
            }
            if (subPath != null) {
                fileManager.deleteFile(subPath, "goods/");
            }
            throw e;
        }
    }
}
