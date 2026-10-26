package com.happywecan.portfolio.page.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.happywecan.portfolio.page.domain.PageDocument;

public interface PageRepository extends MongoRepository<PageDocument, String> {
    Optional<PageDocument> findBySlug(String slug);
}
