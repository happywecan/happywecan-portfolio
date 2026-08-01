package com.happywecan.portfolio.admin.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.happywecan.portfolio.admin.domain.AdminUserDocument;
import com.happywecan.portfolio.admin.repository.AdminUserRepository;

@Component
public class AdminBootstrap implements ApplicationRunner {
    private final AdminUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final String email;
    private final String password;
    private final String nickname;

    public AdminBootstrap(
            AdminUserRepository repository,
            PasswordEncoder passwordEncoder,
            @Value("${ADMIN_USER:}") String email,
            @Value("${ADMIN_PASSWORD:}") String password,
            @Value("${ADMIN_NICKNAME:Admin}") String nickname) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!email.isBlank() && !password.isBlank() && repository.findByEmailIgnoreCase(email).isEmpty()) {
            repository.save(new AdminUserDocument(email.trim().toLowerCase(),
                    passwordEncoder.encode(password), nickname));
        }
    }
}
