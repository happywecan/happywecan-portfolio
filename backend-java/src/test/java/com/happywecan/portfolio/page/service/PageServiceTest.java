package com.happywecan.portfolio.page.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.happywecan.portfolio.shared.error.ConflictException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.happywecan.portfolio.page.domain.PageDocument;
import com.happywecan.portfolio.page.repository.PageRepository;
import com.happywecan.portfolio.page.web.PageBlockRequest;
import com.happywecan.portfolio.page.web.PageRequest;
import com.happywecan.portfolio.page.web.PageResponse;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PageServiceTest {
    @Mock private PageRepository repository;

    @Test
    void createsBackwardCompatibleHomepageByDefault() {
        when(repository.findBySlug("home")).thenReturn(Optional.empty());
        when(repository.save(any(PageDocument.class))).thenAnswer(call -> call.getArgument(0));
        var result = new PageService(repository).findBySlug("home");
        assertThat(result.blocks()).hasSize(1);
        assertThat(result.blocks().getFirst().type()).isEqualTo("editorial");
        assertThat(result.blocks().getFirst().enabled()).isTrue();
    }

    @Test
    void savesOrderedBlocks() {
        when(repository.findBySlug("home")).thenReturn(Optional.empty());
        when(repository.save(any(PageDocument.class))).thenAnswer(call -> call.getArgument(0));
        var request = new PageRequest("首頁", 0L, List.of(
                new PageBlockRequest("one", "rich_text", true, Map.of("title", "第一段")),
                new PageBlockRequest("two", "cta", false, Map.of("title", "第二段", "button_label", "聯絡", "button_url", "#contact"))));
        var result = new PageService(repository).update("home", request);
        assertThat(result.blocks()).extracting(PageResponse.BlockResponse::id).containsExactly("one", "two");
        assertThat(result.blocks().get(1).enabled()).isFalse();
    }

    @Test
    void rejectsUnsafeCtaUrl() {
        var request = new PageRequest("首頁", 0L, List.of(
                new PageBlockRequest("cta", "cta", true, Map.of("title", "標題", "button_label", "前往", "button_url", "javascript:alert(1)"))));
        assertThatThrownBy(() -> new PageService(repository).update("home", request))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void keepsPreviousPublishedPageAndRejectsStaleVersion() {
        var document = new PageDocument("page", "home", "舊標題", List.of(), java.time.LocalDateTime.now());
        when(repository.findBySlug("home")).thenReturn(Optional.of(document));
        when(repository.save(any(PageDocument.class))).thenAnswer(call -> call.getArgument(0));
        var updated = new PageService(repository).update("home", new PageRequest("新標題", 0L, List.of()));
        assertThat(updated.title()).isEqualTo("新標題");
        assertThat(document.getRevisions()).hasSize(1);
        assertThat(document.getRevisions().getFirst().title()).isEqualTo("舊標題");
        assertThatThrownBy(() -> new PageService(repository).update("home", new PageRequest("過期內容", 1L, List.of())))
                .isInstanceOf(ConflictException.class);
    }
}
