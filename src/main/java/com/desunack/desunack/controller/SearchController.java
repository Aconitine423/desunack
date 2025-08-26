package com.desunack.desunack.controller;

import com.desunack.desunack.service.SearchService;
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
    public String filterSearch(ArrayList<String> filterList) {
        if(serSer.filterSearch(filterList)){
            return null;
        }
        return null;
    }
}
