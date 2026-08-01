package com.happywecan.portfolio.hobby.web;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record HobbyRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Size(max = 80) String icon,
        @Size(max = 1000) String description) {
}
