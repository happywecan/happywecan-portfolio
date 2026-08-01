package com.happywecan.portfolio.newsletter.repository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.happywecan.portfolio.newsletter.domain.NewsletterSubscriberDocument;

public interface NewsletterRepository extends MongoRepository<NewsletterSubscriberDocument, String> {
    Optional<NewsletterSubscriberDocument> findByEmailIgnoreCase(String email);
    List<NewsletterSubscriberDocument> findAllByOrderBySubscribedAtDesc();
}
