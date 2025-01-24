package com.example.backend.controllers;

import com.example.backend.domain.User;
import com.example.backend.request.LoginRequest;
import com.example.backend.request.SignupRequest;
import com.example.backend.response.LoginResponse;
import com.example.backend.response.SignupResponse;
import com.example.backend.services.JwtService;
import com.example.backend.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@RequestBody SignupRequest request) {
        User savedUser = userService.createUser(request);
        return new ResponseEntity<>(new SignupResponse("User created successfully", savedUser.getId()), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        User authenticatedUser = userService.authenticateUser(request.email(), request.password());
        String jwt = jwtService.generateToken(authenticatedUser);
        return ResponseEntity.ok(new LoginResponse(jwt, jwtService.getExpirationTime(), authenticatedUser.getName(), authenticatedUser.getId()));
    }

    @PostMapping("/auth")
    public ResponseEntity<Object> authenticate() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.isAuthenticated()) {
            return ResponseEntity.ok("{\"message\": \"User is authenticated\"}");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"User is not authenticated\"}");
        }
    }
}
