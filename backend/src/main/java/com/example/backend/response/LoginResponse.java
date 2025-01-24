package com.example.backend.response;

public record LoginResponse(String token, Long expiresIn, String username, Long userId) {
}
