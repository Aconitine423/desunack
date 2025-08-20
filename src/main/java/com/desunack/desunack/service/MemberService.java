package com.desunack.desunack.service;


import com.desunack.desunack.DAO.MemberDao;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MemberService {
    @Autowired
    private MemberDao mDao;


    public boolean login1(){
        return false;
    }
}
