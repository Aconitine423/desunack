package com.desunack.desunack.service;

import com.desunack.desunack.DAO.SearchDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchService {
    private final SearchDao searchDao;


    public boolean filterSearch(ArrayList<String> filterList) {
        int startIdx = 0;
        int size = 10;
        String Json = searchDao.filterSearch(filterList, startIdx, size);
        return false;
    }
}
