package com.happywecan.portfolio.contact.domain;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "contacts")
public record ContactDocument(
        @Id String id,
        String name,
        String email,
        String message,
        @Field("created_at") Instant createdAt,
        boolean read,
        boolean replied) {
}
