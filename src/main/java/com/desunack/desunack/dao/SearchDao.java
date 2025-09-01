package com.desunack.desunack.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;

@Mapper
public interface SearchDao {
    ArrayList<String> filterSearch(ArrayList<Integer> filteredList, int startIdx, int size);

    ArrayList<Integer> sweetenerFilter(ArrayList<String> sweetenerList);

    ArrayList<Integer> AllergyFilter(ArrayList<String> AllergyList);

    ArrayList<String> categorySearch(String categoryName, int startIdx, int size);

    ArrayList<String> getAllBrand();

    String getBMap(String bName);
}
