package com.happywecan.portfolio.portfolio.web;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.happywecan.portfolio.portfolio.domain.PortfolioLink;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PortfolioRequest(
        @NotBlank @Size(max = 160) String title,
        @NotBlank @Size(max = 1000) String description,
        @Size(max = 100000) String content,
        @JsonProperty("image_url") @Size(max = 2000) String imageUrl,
        @JsonProperty("github_url") @Size(max = 2000) String githubUrl,
        @JsonProperty("demo_url") @Size(max = 2000) String demoUrl,
        List<PortfolioLink> links,
        List<@Size(max = 50) String> tags) {
}
