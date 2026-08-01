package com.happywecan.portfolio.blog.web;

import java.time.Instant;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.happywecan.portfolio.blog.domain.BlogPostDocument;

public record BlogPostResponse(
        String id,
        String title,
        String subtitle,
        String content,
        @JsonProperty("cover_image") String coverImage,
        List<String> tags,
        @JsonProperty("is_published") boolean published,
        @JsonProperty("created_at") Instant createdAt,
        @JsonProperty("published_at") Instant publishedAt,
        @JsonProperty("updated_at") Instant updatedAt) {
    public static BlogPostResponse from(BlogPostDocument value) {
        return new BlogPostResponse(value.id(), value.title(), value.subtitle(), value.content(),
                value.coverImage(), value.tags() == null ? List.of() : value.tags(), value.published(),
                value.createdAt(), value.publishedAt(), value.updatedAt());
    }
}
