package com.desunack.desunack.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

@EnableWebSecurity
@Slf4j
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
       // 인증(Authentication, 로그인 여부)
        http.formLogin(
                form -> form.loginPage("/member/login") // 로그인 페이지 열기 url
                        .loginProcessingUrl("/member/login") // 로그인 진행 url, 컨트롤러 정의 불필요
                        .defaultSuccessUrl("/") // 로그인 성공시 이동할 url
                        // 실패시 기본값(로그인 페이지 열기 url)
                        .failureUrl("/member/login/error") // 선택사항
//                        .failureHandler(authenticationFailureHandler)
//                        .usernameParameter("username") // 기본값, 파라미터 받을 지칭을 바꿈 (ex. id)
//                        .passwordParameter("password") // 기본값, 파라미터 받을 지칭을 바꿈 (ex. pw)
//                        .permitAll() // 권한 상관없이 모든 사용자들에게 접근을 허용함 (비권장)
                // permitAll() 해서 authorizeHttpRequests()로 각 요청 url마다 개별적으로 권한을 따로 지정하는 것보단
                // 컨트롤러에 @PreAuthorize @Secured 로 명시하는 것이 편할 수도 있다.
        );
        //authorizeHttpRequests() 구현 예시
//        http.authorizeHttpRequests(request -> request
        //시큐리티6.0부터 forward 방식 페이지 이동에도 default로 인증이 걸리므로 허용.
//				.dispatcherTypeMatchers(DispatcherType.FORWARD).permitAll()
//				//resources/static/이하폴더 허용
//				.requestMatchers("/images/**", "/css/**", "/js/**").permitAll()
//				.requestMatchers("/","/member/anyone","/member/login").permitAll()
//				.requestMatchers("/member/anonymous").anonymous()
//				.requestMatchers("/member/admin").hasRole("ADMIN")
//				.requestMatchers("/member/user").hasAnyRole("USER","ADMIN")
//				.anyRequest().authenticated()
//        );

        // 컨트롤러에 정의 할 필요 없음
        // csrf토큰 설정시 post 요청만 처리함
        http.logout(
                logout -> logout.logoutUrl("/member/logout")
                        .logoutSuccessUrl("/")
        );

        //동일 출처에서만 iframe 허용
        http.headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
        );
        return http.build();
    }

    // 시큐리티 비밀번호 암호화 필수
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
