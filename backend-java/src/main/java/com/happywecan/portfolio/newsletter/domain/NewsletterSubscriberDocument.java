package com.happywecan.portfolio.newsletter.domain;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "newsletter_subscribers")
public record NewsletterSubscriberDocument(
        @Id String id, String email,
        @Field("subscribed_at") Instant subscribedAt,
        boolean active, String source) {
}
