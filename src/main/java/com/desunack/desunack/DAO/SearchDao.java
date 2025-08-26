package com.desunack.desunack.DAO;

import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;

@Mapper
public interface SearchDao {
    String filterSearch(ArrayList<String> filteredList, int startIdx, int size);

    ArrayList<String> sweetenerFilter(ArrayList<String> sweetenerList);

    ArrayList<String> AllergyFilter(ArrayList<String> AllergyList);
}
