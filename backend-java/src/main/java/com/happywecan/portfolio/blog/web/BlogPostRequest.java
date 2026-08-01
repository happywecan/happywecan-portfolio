package com.happywecan.portfolio.blog.web;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BlogPostRequest(
        @NotBlank @Size(max = 200) String title,
        @Size(max = 500) String subtitle,
        @Size(max = 200000) String content,
        @JsonProperty("cover_image") @Size(max = 2000) String coverImage,
        List<@Size(max = 50) String> tags,
        @JsonProperty("is_published") boolean published) {
}
