package com.example.backend.exceptions;

import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

public class AuthException {
    public final Map<String, List<String>> errors;
    public final HttpStatus httpStatus;

    public AuthException(Map<String, List<String>> errors, HttpStatus httpStatus) {
        this.errors = errors;
        this.httpStatus = httpStatus;
    }
}
