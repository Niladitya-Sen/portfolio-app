package com.example.backend.exceptions;

import org.springframework.http.HttpStatus;

public class HttpException {
    private final String messages;
    private final HttpStatus httpStatus;

    public HttpException(String messages, HttpStatus httpStatus) {
        this.messages = messages;
        this.httpStatus = httpStatus;
    }

    public String getMessages() {
        return messages;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
