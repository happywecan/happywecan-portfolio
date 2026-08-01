package com.happywecan.portfolio.newsletter.service;

import java.time.Instant;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import com.happywecan.portfolio.newsletter.domain.NewsletterSubscriberDocument;
import com.happywecan.portfolio.newsletter.repository.NewsletterRepository;
import com.happywecan.portfolio.newsletter.web.NewsletterRequest;
import com.happywecan.portfolio.shared.error.ConflictException;
import com.happywecan.portfolio.shared.error.InvalidIdException;
import com.happywecan.portfolio.shared.error.ResourceNotFoundException;
import com.happywecan.portfolio.newsletter.web.NewsletterResponse;

@Service
public class NewsletterService {
    private final NewsletterRepository repository;
    public NewsletterService(NewsletterRepository repository) { this.repository = repository; }
    public NewsletterSubscriberDocument subscribe(NewsletterRequest request) {
        String email = request.email().trim().toLowerCase();
        var existing = repository.findByEmailIgnoreCase(email);
        if (existing.isPresent() && existing.get().active()) {
            throw new ConflictException("This email is already subscribed.");
        }
        String id = existing.map(NewsletterSubscriberDocument::id).orElse(null);
        return repository.save(new NewsletterSubscriberDocument(id, email, Instant.now(), true,
                request.source() == null ? "about_page" : request.source()));
    }

    public List<NewsletterResponse> findAll() {
        return repository.findAllByOrderBySubscribedAtDesc().stream().map(NewsletterResponse::from).toList();
    }

    public NewsletterResponse setActive(String id, boolean active) {
        validate(id);
        NewsletterSubscriberDocument value = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscriber", id));
        return NewsletterResponse.from(repository.save(new NewsletterSubscriberDocument(
                id, value.email(), value.subscribedAt(), active, value.source())));
    }

    public void delete(String id) {
        validate(id);
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Subscriber", id);
        repository.deleteById(id);
    }

    private void validate(String id) {
        if (!ObjectId.isValid(id)) throw new InvalidIdException("subscriber", id);
    }
}
