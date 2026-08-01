package com.happywecan.portfolio.portfolio.web;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.happywecan.portfolio.portfolio.domain.PortfolioDocument;
import com.happywecan.portfolio.portfolio.domain.PortfolioLink;

public record PortfolioResponse(
        String id,
        String title,
        String description,
        String content,
        @JsonProperty("image_url") String imageUrl,
        @JsonProperty("github_url") String githubUrl,
        @JsonProperty("demo_url") String demoUrl,
        List<PortfolioLink> links,
        List<String> tags,
        @JsonProperty("created_at") LocalDateTime createdAt,
        @JsonProperty("updated_at") LocalDateTime updatedAt) {

    public static PortfolioResponse from(PortfolioDocument document) {
        return new PortfolioResponse(
                document.getId(),
                document.getTitle(),
                document.getDescription(),
                document.getContent(),
                document.getImageUrl(),
                document.getGithubUrl(),
                document.getDemoUrl(),
                document.getLinks(),
                document.getTags(),
                document.getCreatedAt(),
                document.getUpdatedAt());
    }
}
