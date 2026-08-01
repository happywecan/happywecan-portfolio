package com.happywecan.portfolio.config;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.mongodb.autoconfigure.MongoClientSettingsBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MongoConfig {

    @Bean
    MongoClientSettingsBuilderCustomizer mongoTimeouts(
            @Value("${app.mongodb.server-selection-timeout:5s}") Duration serverSelectionTimeout,
            @Value("${app.mongodb.connect-timeout:3s}") Duration connectTimeout) {
        return settings -> {
            settings.applyToClusterSettings(cluster -> cluster.serverSelectionTimeout(
                    serverSelectionTimeout.toMillis(), TimeUnit.MILLISECONDS));
            settings.applyToSocketSettings(socket -> socket.connectTimeout(
                    connectTimeout.toMillis(), TimeUnit.MILLISECONDS));
        };
    }
}
