package com.desunack.desunack.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Slf4j
@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
       // 인증(Authentication, 로그인 여부)
//        http.formLogin(form -> form
//                .loginPage("/member/login") // 로그인 페이지 URL
//                .loginProcessingUrl("/member/login") // 로그인 폼 데이터가 제출될 URL
//                .defaultSuccessUrl("/") // 로그인 성공 후 이동할 기본 페이지
//                .permitAll() // 위 URL들을 모든 사용자에게 허용
//        );
        // CSRF 보호 비활성화
        http.csrf(AbstractHttpConfigurer::disable);

        // 접근 개별 허용
        http.authorizeHttpRequests(auth -> auth
                // 1. 로그인, 회원가입 관련 URL을 모든 사용자에게 허용
                .requestMatchers("/", "/signup/**", "/find/**","/login" , "/goods/**").permitAll()
                // 2. 정적 리소스 (이미지, CSS, JS)에 대한 접근 허용
                .requestMatchers("/img/**", "/css/**", "/js/**", "/common/**").permitAll()
                // 3. 관리자 URL은 'ADMIN' 역할만 접근 허용
                .requestMatchers("/admin/**").hasRole("A")
                // 4. 회원 URL은 'C' 역할만 접근 허용
                .requestMatchers("/member/**").hasAnyRole("C", "S", "A")
                // 4. 위에 명시되지 않은 모든 요청은 인증 필요
                .anyRequest().authenticated()
        );
        // 컨트롤러에 정의 할 필요 없음
        // csrf토큰 설정시 post 요청만 처리함
        http.logout(
                logout -> logout.logoutUrl("/member/logout")
                        .logoutSuccessUrl("/")
        );

        //동일 출처에서만 iframe 허용
        http.headers(headers -> headers
                .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
        );
        return http.build();
    }

    // 시큐리티 비밀번호 암호화 필수
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
