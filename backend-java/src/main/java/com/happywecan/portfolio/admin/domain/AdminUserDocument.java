package com.happywecan.portfolio.admin.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "users")
public class AdminUserDocument {

    @Id
    private String id;
    private String email;

    @Field("password_hash")
    private String passwordHash;

    private String nickname;

    @Field("last_login")
    private LocalDateTime lastLogin;

    protected AdminUserDocument() {
    }

    public AdminUserDocument(String email, String passwordHash, String nickname) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.nickname = nickname;
        this.lastLogin = null;
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getNickname() {
        return nickname;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void markLoggedIn(LocalDateTime time) {
        this.lastLogin = time;
    }
}
