package com.desunack.desunack.service;

import com.desunack.desunack.DAO.SearchDao;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchService {
    private final SearchDao searchDao;

    public ArrayList<Integer> sweetenerFilter(ArrayList<String> checkedSweetener){
        return searchDao.sweetenerFilter(checkedSweetener);
    }

    public ArrayList<Integer> allergyFilter(ArrayList<String> checkedAllergy){
        return searchDao.sweetenerFilter(checkedAllergy);
    }

    public boolean filterSearch(int pNum, ArrayList<String> checkedSweetener, ArrayList<String> checkedAllergy, HttpSession session) {
        int startIdx = (pNum-1)*10;
        int size = 10;
        ArrayList<Integer> sList = sweetenerFilter(checkedSweetener);
        ArrayList<Integer> aList = allergyFilter(checkedAllergy);
        ArrayList<Integer> filterList = new ArrayList<>();
        for(int s : sList){
            for(int a : aList){
                if(s == a){
                    filterList.add(s);
                    break;
                }
            }
        }

        String Json = searchDao.filterSearch(filterList, startIdx, size);
        if(Json != null){
            session.setAttribute("Json", Json);
            return true;
        }
        return false;
    }


    public boolean categoryList(int pNum, String categoryName, HttpSession session) {
        int startIdx = (pNum-1)*10;
        int size = 10;

        String Json = searchDao.categorySearch(categoryName, startIdx, size);
        if(Json != null){
            session.setAttribute("Json", Json);
            return true;
        }
        return false;
    }
}
