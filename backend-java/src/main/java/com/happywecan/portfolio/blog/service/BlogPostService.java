package com.happywecan.portfolio.blog.service;

import java.time.Instant;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import com.happywecan.portfolio.blog.domain.BlogPostDocument;
import com.happywecan.portfolio.blog.repository.BlogPostRepository;
import com.happywecan.portfolio.blog.web.BlogPostRequest;
import com.happywecan.portfolio.blog.web.BlogPostResponse;
import com.happywecan.portfolio.shared.error.InvalidIdException;
import com.happywecan.portfolio.shared.error.ResourceNotFoundException;

@Service
public class BlogPostService {
    private final BlogPostRepository repository;
    public BlogPostService(BlogPostRepository repository) { this.repository = repository; }

    public List<BlogPostResponse> findPublic() {
        return repository.findAllByPublishedTrueOrderByPublishedAtDesc()
                .stream().map(BlogPostResponse::from).toList();
    }
    public List<BlogPostResponse> findAllAdmin() {
        return repository.findAllByOrderByCreatedAtDesc().stream().map(BlogPostResponse::from).toList();
    }
    public BlogPostResponse findPublicById(String id) {
        validate(id);
        return repository.findByIdAndPublishedTrue(id).map(BlogPostResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post", id));
    }
    public BlogPostResponse create(BlogPostRequest request) {
        Instant now = Instant.now();
        BlogPostDocument value = new BlogPostDocument(null, request.title(), request.subtitle(),
                request.content(), request.coverImage(), request.tags(), request.published(), now,
                request.published() ? now : null, null);
        return BlogPostResponse.from(repository.save(value));
    }
    public BlogPostResponse update(String id, BlogPostRequest request) {
        validate(id);
        BlogPostDocument existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post", id));
        Instant now = Instant.now();
        Instant publishedAt = !existing.published() && request.published() ? now : existing.publishedAt();
        BlogPostDocument updated = new BlogPostDocument(id, request.title(), request.subtitle(),
                request.content(), request.coverImage(), request.tags(), request.published(),
                existing.createdAt(), publishedAt, now);
        return BlogPostResponse.from(repository.save(updated));
    }
    public void delete(String id) {
        validate(id);
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Blog post", id);
        repository.deleteById(id);
    }
    public long countPublic() {
        return repository.countByPublishedTrue();
    }
    private void validate(String id) { if (!ObjectId.isValid(id)) throw new InvalidIdException("blog post", id); }
}
