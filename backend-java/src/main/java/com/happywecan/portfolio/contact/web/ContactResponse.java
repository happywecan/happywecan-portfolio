package com.happywecan.portfolio.contact.web;

import java.time.Instant;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.happywecan.portfolio.contact.domain.ContactDocument;

public record ContactResponse(
        String id, String name, String email, String message,
        @JsonProperty("created_at") Instant createdAt,
        boolean read, boolean replied) {
    public static ContactResponse from(ContactDocument value) {
        return new ContactResponse(value.id(), value.name(), value.email(), value.message(),
                value.createdAt(), value.read(), value.replied());
    }
}
