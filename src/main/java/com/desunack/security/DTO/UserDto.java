package com.desunack.desunack.DTO;

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
public class UserDto {
    private int userUid;
    private String userId;
    private String userName;
    private String userPw;
    private String userEmail;
    private String userPost;
    private String userAddress;
    private String userAddressDetail;
    private char userKind;
    private char userStatus;
    private LocalDate userSignupDate;
    private LocalDate userRecentDate;


}

