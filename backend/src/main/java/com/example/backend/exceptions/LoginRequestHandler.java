package com.example.backend.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class LoginRequestHandler {
    @ExceptionHandler(LoginRequestException.class)
    public ResponseEntity<Object> handleLoginRequestException(LoginRequestException ex) {
        AuthException authException = new AuthException(ex.errors, ex.httpStatus);
        return new ResponseEntity<>(authException, ex.httpStatus);
    }
}
