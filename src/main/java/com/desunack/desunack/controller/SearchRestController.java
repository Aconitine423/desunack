package com.desunack.desunack.controller;

import com.desunack.desunack.dto.SearchDto;
import com.desunack.desunack.service.SearchService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class SearchRestController {
    private final SearchService serSer;

    // 통합 필터 검색
    @PostMapping("/search/goods")
    public ResponseEntity<List<Map<String, Object>>> searchGoods(@RequestBody SearchDto searchDto) {
        List<Map<String, Object>> searchResults =  serSer.searchGoods(searchDto);
        return ResponseEntity.ok(searchResults);
    }
}
