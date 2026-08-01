package com.happywecan.portfolio.newsletter.web;

import java.time.Instant;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.happywecan.portfolio.newsletter.domain.NewsletterSubscriberDocument;

public record NewsletterResponse(
        String id, String email,
        @JsonProperty("subscribed_at") Instant subscribedAt,
        boolean active, String source) {
    public static NewsletterResponse from(NewsletterSubscriberDocument value) {
        return new NewsletterResponse(value.id(), value.email(), value.subscribedAt(), value.active(), value.source());
    }
}
