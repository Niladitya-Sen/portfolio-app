package com.example.backend.services;

import com.example.backend.domain.User;
import com.example.backend.exceptions.LoginRequestException;
import com.example.backend.exceptions.SignupRequestException;
import com.example.backend.repositories.UserRepository;
import com.example.backend.request.SignupRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final StockService stockService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, StockService stockService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.stockService = stockService;
    }

    @Transactional
    public User createUser(SignupRequest request) {
        Map<String, List<String>> errors = new HashMap<>();

        // Validate name
        if (request.name() == null || request.name().isEmpty()) {
            errors.computeIfAbsent("name", k -> new ArrayList<>()).add("Name is required");
        }

        // Validate email
        if (request.email() == null || request.email().isEmpty()) {
            errors.computeIfAbsent("email", k -> new ArrayList<>()).add("Email is required");
        } else if (userRepository.existsByEmail(request.email())) {
            errors.computeIfAbsent("email", k -> new ArrayList<>()).add("Email is already taken");
        }

        // Validate password
        if (request.password() == null || request.password().isEmpty()) {
            errors.computeIfAbsent("password", k -> new ArrayList<>()).add("Password is required");
        } else if (request.password().length() < 6) {
            errors.computeIfAbsent("password", k -> new ArrayList<>()).add("Password must be at least 6 characters long");
        }

        // Validate confirmPassword
        if (request.confirmPassword() == null || request.confirmPassword().isEmpty()) {
            errors.computeIfAbsent("confirmPassword", k -> new ArrayList<>()).add("Confirm Password is required");
        } else if (request.password() != null && !request.password().equals(request.confirmPassword())) {
            errors.computeIfAbsent("confirmPassword", k -> new ArrayList<>()).add("Passwords do not match");
        }

        // Throw exception if errors exist
        if (!errors.isEmpty()) {
            throw new SignupRequestException(errors, HttpStatus.BAD_REQUEST);
        }

        // Create and save the user
        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        User savedUser = userRepository.save(user);

        // Insert default stocks
        stockService.insert5Stocks(savedUser);

        return savedUser;
    }

    public User authenticateUser(String email, String rawPassword) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, rawPassword));
            return (User) authentication.getPrincipal();
        } catch (AuthenticationException ex) {
            Map<String, List<String>> errors = new HashMap<>();
            errors.computeIfAbsent("email", k -> new ArrayList<>()).add("Invalid email or password");
            errors.computeIfAbsent("password", k -> new ArrayList<>()).add("Invalid email or password");
            throw new LoginRequestException(errors, HttpStatus.UNAUTHORIZED);
        }
    }
}
