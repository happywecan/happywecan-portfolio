package com.happywecan.portfolio.page.web;

import java.util.Map;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PageBlockRequest(
        @NotBlank @Size(max = 80) String id,
        @NotBlank @Pattern(regexp = "editorial|hero|about|skills|portfolio|blog|contact|rich_text|image_text|cta|spacer") String type,
        boolean enabled,
        @NotNull Map<String, Object> content) {}
