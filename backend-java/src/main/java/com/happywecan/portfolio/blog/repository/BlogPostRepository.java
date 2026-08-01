package com.happywecan.portfolio.blog.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.happywecan.portfolio.blog.domain.BlogPostDocument;

public interface BlogPostRepository extends MongoRepository<BlogPostDocument, String> {
    List<BlogPostDocument> findAllByPublishedTrueOrderByPublishedAtDesc();
    List<BlogPostDocument> findAllByOrderByCreatedAtDesc();
    Optional<BlogPostDocument> findByIdAndPublishedTrue(String id);
    long countByPublishedTrue();
}
