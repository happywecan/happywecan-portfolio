package com.happywecan.portfolio.newsletter.service;

import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import com.happywecan.portfolio.newsletter.domain.NewsletterSubscriberDocument;
import com.happywecan.portfolio.newsletter.repository.NewsletterRepository;
import com.happywecan.portfolio.newsletter.web.NewsletterRequest;
import com.happywecan.portfolio.shared.error.ConflictException;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

class NewsletterServiceTest {
    @Test
    void rejectsAlreadyActiveSubscriber() {
        NewsletterRepository repository = Mockito.mock(NewsletterRepository.class);
        when(repository.findByEmailIgnoreCase("reader@example.com")).thenReturn(Optional.of(
                new NewsletterSubscriberDocument("507f1f77bcf86cd799439011", "reader@example.com",
                        Instant.now(), true, "footer")));
        NewsletterService service = new NewsletterService(repository);

        assertThatThrownBy(() -> service.subscribe(new NewsletterRequest("reader@example.com", "footer")))
                .isInstanceOf(ConflictException.class);
    }
}
