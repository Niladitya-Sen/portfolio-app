package com.example.backend.request;

public record SignupRequest(String name, String email, String password, String confirmPassword) {
}
