package com.desunack.desunack.service;

import com.desunack.desunack.common.FileManager;
import com.desunack.desunack.dao.GoodsDao;
import com.desunack.desunack.dto.*;
import com.desunack.desunack.entity.SellerEntity;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class GoodsService {
    private final GoodsDao goodsDao;
    private final FileManager fileManager;

    public ArrayList<Integer> getAList(TransferAllergyDto taDTO) {
        ArrayList<Integer> aList = new ArrayList<>();
        if (taDTO.isAllergy1()) {
            aList.add(1);
        }
        if (taDTO.isAllergy2()) {
            aList.add(2);
        }
        if (taDTO.isAllergy3()) {
            aList.add(3);
        }
        if (taDTO.isAllergy4()) {
            aList.add(4);
        }
        if (taDTO.isAllergy5()) {
            aList.add(5);
        }
        if (taDTO.isAllergy6()) {
            aList.add(6);
        }
        if (taDTO.isAllergy7()) {
            aList.add(7);
        }
        if (taDTO.isAllergy8()) {
            aList.add(8);
        }
        return aList;
    }

    public ArrayList<Integer> getSList(TransferSweetenerDto tsDto) {
        ArrayList<Integer> sList = new ArrayList<>();
        if (tsDto.isSweetener1()) {
            sList.add(1);
        }
        if (tsDto.isSweetener2()) {
            sList.add(2);
        }
        if (tsDto.isSweetener3()) {
            sList.add(3);
        }
        if (tsDto.isSweetener4()) {
            sList.add(4);
        }
        if (tsDto.isSweetener5()) {
            sList.add(5);
        }
        if (tsDto.isSweetener6()) {
            sList.add(6);
        }
        if (tsDto.isSweetener7()) {
            sList.add(7);
        }
        if (tsDto.isSweetener8()) {
            sList.add(8);
        }
        if (tsDto.isSweetener9()) {
            sList.add(9);
        }
        if (tsDto.isSweetener10()) {
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
            log.info("======알러지{}", aList);
            if (goodsDao.goodsRegistrate(goodsDto)) {
                int g_id = goodsDto.getG_id();
                giDto.setGi_g_id(g_id);
                if (goodsDao.goodsTotalSales(g_id)) {
                    if (goodsDao.goodsInfo(giDto)) {
                        if (goodsDao.goodsSweetener(g_id, sList)) {
                            if (!aList.isEmpty()) {
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

    public boolean getGoodsDetail(int g_id, Model model) {
        GoodsDto gDto = goodsDao.getGoods(g_id);
        GoodsInfoDto giDto = goodsDao.getGoodsInfo(g_id);
        ArrayList<String> reviews = goodsDao.getReviewList(g_id);
        if (gDto != null && giDto != null) {
            model.addAttribute("goodsDto", gDto);
            model.addAttribute("goodsInfoDto", giDto);
            if (reviews != null) {
                model.addAttribute("reviews", reviews);
            }
            return true;
        }
        return false;
    }

    @Transactional
    public void insertFavorite(FavoriteDto fDto) throws Exception {
        try {
            goodsDao.insertFavorite(fDto);
        } catch (Exception e) {
            throw e;
        }
    }

    public void insertCart(ShoppingCartDto scDto) throws Exception {
        try {
            goodsDao.insertCart(scDto);
        } catch (Exception e) {
            throw e;
        }
    }

    public boolean getShoppingCart(int userUid, Model model) {
        ArrayList<String> scList = goodsDao.getShoppingCart(userUid);
        if (scList != null) {
            model.addAttribute("scList", scList);
            return true;
        }
        return false;
    }

    public void deleteShoppingCart(ShoppingCartDto shoppingCartDto) {
        int g_id = shoppingCartDto.getSc_g_id();
        int m_uid = shoppingCartDto.getSc_m_uid();
        goodsDao.deleteShoppingCart(g_id, m_uid);

    }

    public boolean getFavorite(int userUid, Model model) {
        ArrayList<String> favoriteList = goodsDao.getFavorite(userUid);
        if (favoriteList != null) {
            model.addAttribute("fList", favoriteList);
            return true;
        }
        return false;
    }

    public void deleteFavorite(FavoriteDto favoriteDto) {
        int g_id = favoriteDto.getF_g_id();
        int m_uid = favoriteDto.getF_m_uid();
        goodsDao.deleteFavorite(g_id, m_uid);
    }

    // 혈당 평균값 불러오기
    public BloodGlucoseSummaryDto getAggregatedGlucoseData(int gId) {
        // 1. 레포지토리에서 그룹별 평균 데이터 리스트 조회
        List<Map<String, Object>> avgResults = goodsDao.findAvgGlucoseGroupedByHealthyStatus(gId);

        // 2. 최종 DTO 초기화
        BloodGlucoseSummaryDto summaryDto = new BloodGlucoseSummaryDto();

        // 3. 리스트를 반복하며 'Y'와 'N' 그룹을 최종 DTO에 매핑
        for (Map<String, Object> result : avgResults) {
            String healthyStatus = (String) result.get("dr_healthy"); // 'Y' 또는 'N'

            // 1. Map에서 Object를 BigDecimal로 안전하게 캐스팅
            BigDecimal beforeBd = (BigDecimal) result.get("avg_before");
            BigDecimal after0hBd = (BigDecimal) result.get("avg_after1");
            BigDecimal after1hBd = (BigDecimal) result.get("avg_after2");

            // 2. BigDecimal 객체를 doubleValue()를 사용하여 double 타입으로 변환
            double before = beforeBd.doubleValue();
            double after0h = after0hBd.doubleValue();
            double after1h = after1hBd.doubleValue();

            // GlucoseGroup DTO 생성
            BloodGlucoseSummaryDto.GlucoseGroup group = BloodGlucoseSummaryDto.GlucoseGroup.builder()
                    .BEFORE(before)
                    .AFTER_0H(after0h)
                    .AFTER_1H(after1h)
                    .build();

            if ("Y".equalsIgnoreCase(healthyStatus)) {
                // 'Y' 그룹 (당뇨약 섭취) 매핑
                summaryDto.setMedication_y(group);
            } else if ("N".equalsIgnoreCase(healthyStatus)) {
                // 'N' 그룹 (당뇨약 비섭취) 매핑
                summaryDto.setMedication_n(group);
            }
        }
        // 4. 데이터 누락 방지: Y 또는 N 그룹에 리뷰가 아예 없어 DTO 필드가 null인 경우 빈 객체로 초기화
        if (summaryDto.getMedication_y() == null) {
            summaryDto.setMedication_y(new BloodGlucoseSummaryDto.GlucoseGroup());
        }
        if (summaryDto.getMedication_n() == null) {
            summaryDto.setMedication_n(new BloodGlucoseSummaryDto.GlucoseGroup());
        }

        return summaryDto;
    }
}
