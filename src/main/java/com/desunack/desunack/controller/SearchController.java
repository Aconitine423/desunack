package com.desunack.desunack.controller;

import com.desunack.desunack.service.SearchService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.support.RequestContextUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@Slf4j
@RequiredArgsConstructor
public class SearchController {
    private final SearchService serSer;
    @GetMapping("/search")
    public String filterSearch(int pNum, ArrayList<String> checkedSweetener, ArrayList<String> checkedAllergy, HttpSession session) {
        if(serSer.filterSearch(pNum, checkedSweetener, checkedAllergy, session)){
            return null;
        }
        return null;
    }

    @GetMapping("/brand")
    public String brandList(HttpSession session) {
        ArrayList<String> bList = serSer.brandList(session);
        if(bList != null){
            serSer.getBMap(bList, session);
            return null;
        }
        return null;
    }

    @GetMapping("/category")
    public String categoryList(String categoryName, int pNum, HttpSession session){
        if(serSer.categoryList(pNum, categoryName, session)){
            return null;
        }
        return null;
    }

    @GetMapping("/search/goodsSearchResult")
    public String goodsSearchResult(HttpServletRequest request, Model model) {
        Map<String, ?> flashMap = RequestContextUtils.getInputFlashMap(request);
        if (flashMap != null) {
            // "searchResults"라는 키로 저장했던 데이터를 꺼내기
            // 원래 타입인 List<Map<String, Object>>로 형변환(casting) 해주기
            List<Map<String, Object>> searchResults = (List<Map<String, Object>>) flashMap.get("searchResults");

            // 데이터가 실제로 존재하면 Model에 추가합니다.
            if (searchResults != null) {
                model.addAttribute("searchResults", searchResults);
            }
        }
        return "/goods/goodsSearchResult";
    }
}
