package com.desunack.desunack.dao;

import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;

@Mapper
public interface SellerDao {

    ArrayList<String> getOrderList(int id);
}
