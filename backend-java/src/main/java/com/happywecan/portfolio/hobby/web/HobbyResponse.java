package com.happywecan.portfolio.hobby.web;

import com.happywecan.portfolio.hobby.domain.HobbyDocument;

public record HobbyResponse(String id, String name, String icon, String description) {
    public static HobbyResponse from(HobbyDocument value) {
        return new HobbyResponse(value.id(), value.name(), value.icon(), value.description());
    }
}
