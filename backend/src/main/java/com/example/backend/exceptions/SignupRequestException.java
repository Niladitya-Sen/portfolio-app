package com.example.backend.exceptions;

import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

public class SignupRequestException extends RuntimeException {
    private final Map<String, List<String>> errors;
    private final HttpStatus httpStatus;

    public SignupRequestException(Map<String, List<String>> errors, HttpStatus httpStatus) {
        super("Signup Validation Failed");
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
