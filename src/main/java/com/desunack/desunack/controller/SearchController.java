package com.desunack.desunack.controller;

import com.desunack.desunack.service.SearchService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;

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
}
