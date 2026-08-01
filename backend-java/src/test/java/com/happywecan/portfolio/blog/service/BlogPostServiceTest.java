package com.happywecan.portfolio.blog.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import com.happywecan.portfolio.blog.domain.BlogPostDocument;
import com.happywecan.portfolio.blog.repository.BlogPostRepository;
import com.happywecan.portfolio.blog.web.BlogPostRequest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

class BlogPostServiceTest {
    private final BlogPostRepository repository = Mockito.mock(BlogPostRepository.class);
    private final BlogPostService service = new BlogPostService(repository);

    @Test
    void publicListingOnlyUsesPublishedQuery() {
        when(repository.findAllByPublishedTrueOrderByPublishedAtDesc()).thenReturn(List.of());
        assertThat(service.findPublic()).isEmpty();
        Mockito.verify(repository).findAllByPublishedTrueOrderByPublishedAtDesc();
        Mockito.verify(repository, Mockito.never()).findAllByOrderByCreatedAtDesc();
    }

    @Test
    void publishingDraftSetsPublishedAt() {
        String id = "507f1f77bcf86cd799439011";
        BlogPostDocument draft = new BlogPostDocument(id, "Draft", null, "Body", null,
                List.of(), false, Instant.now(), null, null);
        when(repository.findById(id)).thenReturn(Optional.of(draft));
        when(repository.save(Mockito.any())).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.update(id, new BlogPostRequest("Published", null, "Body", null, List.of(), true));

        assertThat(result.published()).isTrue();
        assertThat(result.publishedAt()).isNotNull();
    }
}
