package com.desunack.desunack.service;

import com.desunack.desunack.common.FileManager;
import com.desunack.desunack.dao.GoodsDao;
import com.desunack.desunack.dto.GoodsDto;
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

    @Transactional
    public void goodsRegistrate(GoodsDto goodsDto, MultipartFile main, MultipartFile sub,
                                HttpSession session)
            throws Exception {
        String mainPath = null;
        String subPath = null;

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
                    if (goodsDao.goodsSweetener(g_id, goodsDto.getSList())) {
                        if (goodsDto.getAList() != null) {
                            if (goodsDao.goodsAllergy(g_id, goodsDto.getAList())) {

                            }
                        } else {

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
