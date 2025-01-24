package com.example.backend.exceptions;

import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

public class LoginRequestException extends RuntimeException {
    public final Map<String, List<String>> errors;
    public final HttpStatus httpStatus;

    public LoginRequestException(Map <String, List<String>> errors, HttpStatus httpStatus) {
        super("Login Validation Failed");
        this.errors = errors;
        this.httpStatus = httpStatus;
    }

    public Map<String, List<String>> getErrors() {
        return errors;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
