package com.desunack.desunack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;

@Data
@Accessors(chain=true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberDto {
    private int memberUid;
    private String memberId;
    private String memberName;
    private String memberPw;
    private String memberEmail;
    private String memberPost;
    private String memberAddress;
    private String memberAddressDetail;
    private char memberKind;
    private char memberStatus;
    private LocalDate signupDate;
    private LocalDate recentDate;


}

