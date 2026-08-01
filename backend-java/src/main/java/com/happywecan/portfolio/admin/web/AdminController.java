package com.happywecan.portfolio.admin.web;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.happywecan.portfolio.admin.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    @PostMapping(value = "/token", consumes = "application/x-www-form-urlencoded")
    public TokenResponse login(
            @RequestParam String username,
            @RequestParam String password) {
        return service.login(username, password);
    }

    @GetMapping("/me")
    public AdminProfileResponse me(@AuthenticationPrincipal Jwt jwt) {
        return service.profile(jwt.getSubject());
    }
}
