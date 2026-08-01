package com.happywecan.portfolio.blog.domain;

import java.time.Instant;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "blog_posts")
public record BlogPostDocument(
        @Id String id,
        String title,
        String subtitle,
        String content,
        @Field("cover_image") String coverImage,
        List<String> tags,
        @Field("is_published") boolean published,
        @Field("created_at") Instant createdAt,
        @Field("published_at") Instant publishedAt,
        @Field("updated_at") Instant updatedAt) {
}
