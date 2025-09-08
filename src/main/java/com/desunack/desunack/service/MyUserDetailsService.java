package com.desunack.desunack.service;

import com.desunack.desunack.dao.MemberDao;
import com.desunack.desunack.entity.MemberEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class MyUserDetailsService implements UserDetailsService {
    private final MemberDao mDao;

    @Autowired
    public MyUserDetailsService( MemberDao memberDao) {
        this.mDao = memberDao;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        // DB에서 사용자 ID 기반으로 회원 정보 조회
        MemberEntity memberEntity = mDao.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("해당 사용자를 찾을 수 없습니다."+userId));
        log.info("======memberEntity:{}", memberEntity);

        // 회원의 역할을 GrantedAuthority 리스트로 변환
        // 예: member.getRole()이 "C"라면 "ROLE_C"로 변환
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + memberEntity.getM_kind())
        );
        log.info("======authorities:{}", authorities);

        // UserDetails 객체를 만들어 반환. 시큐리티가 이 정보를 사용함.
        UserDetails udetails = new User(memberEntity.getM_id(), memberEntity.getM_pw(), authorities);
//        {
//            @Override
//            public Collection<? extends GrantedAuthority> getAuthorities() {
//                return authorities;
//            }
//
//            @Override
//            public String getPassword() {
//                return memberEntity.getM_pw();
//            }
//
//            @Override
//            public String getUsername() {
//                return memberEntity.getM_id();
//            }
//        };
        log.info("======udetails.getAuthorities:{}", udetails.getAuthorities());
        return udetails;
    }
}
