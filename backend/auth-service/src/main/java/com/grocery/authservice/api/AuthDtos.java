package com.grocery.authservice.api;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {
    public record SignupReq(@Email String email, @NotBlank String password) {}
    public record LoginReq(@Email String email, @NotBlank String password) {}
    public record TokenRes(String accessToken, String tokenType) { public TokenRes(String t){this(t,"Bearer");} }
    public record MeRes(String email, String role) {}
}
