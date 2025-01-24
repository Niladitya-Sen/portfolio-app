package com.example.backend.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class SignupExceptionHandler {
    @ExceptionHandler(SignupRequestException.class)
    public ResponseEntity<Object> handleSignupRequestException(SignupRequestException ex) {
        AuthException authException = new AuthException(ex.getErrors(), ex.getHttpStatus());
        return new ResponseEntity<>(authException, ex.getHttpStatus());
    }
}
