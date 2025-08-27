package com.desunack.desunack.DAO;

import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;

@Mapper
public interface SearchDao {
    String filterSearch(ArrayList<Integer> filteredList, int startIdx, int size);

    ArrayList<Integer> sweetenerFilter(ArrayList<String> sweetenerList);

    ArrayList<Integer> AllergyFilter(ArrayList<String> AllergyList);

    String categorySearch(String categoryName, int startIdx, int size);
}
