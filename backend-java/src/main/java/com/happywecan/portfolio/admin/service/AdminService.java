package com.happywecan.portfolio.admin.service;

import java.time.LocalDateTime;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.happywecan.portfolio.admin.domain.AdminUserDocument;
import com.happywecan.portfolio.admin.repository.AdminUserRepository;
import com.happywecan.portfolio.admin.web.AdminProfileResponse;
import com.happywecan.portfolio.admin.web.TokenResponse;
import com.happywecan.portfolio.security.JwtService;

@Service
public class AdminService {

    private final AdminUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminService(
            AdminUserRepository repository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public TokenResponse login(String email, String password) {
        AdminUserDocument user = repository.findByEmailIgnoreCase(email)
                .filter(found -> passwordEncoder.matches(password, found.getPasswordHash()))
                .orElseThrow(() -> new BadCredentialsException("Incorrect email or password"));

        user.markLoggedIn(LocalDateTime.now());
        repository.save(user);
        return new TokenResponse(jwtService.createToken(user.getEmail()), "bearer");
    }

    public AdminProfileResponse profile(String email) {
        AdminUserDocument user = repository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("Admin user no longer exists"));
        return new AdminProfileResponse(user.getEmail(), user.getNickname());
    }
}
