package com.happywecan.portfolio.security;

import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final JwtEncoder encoder;
    private final Duration expiration;

    public JwtService(
            JwtEncoder encoder,
            @Value("${app.security.jwt-expiration-minutes}") long expirationMinutes) {
        this.encoder = encoder;
        this.expiration = Duration.ofMinutes(expirationMinutes);
    }

    public String createToken(String email) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("happywecan-portfolio")
                .issuedAt(now)
                .expiresAt(now.plus(expiration))
                .subject(email)
                .claim("role", "ADMIN")
                .build();

        return encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}
