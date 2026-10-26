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
    void savesEditableAboutAndSkillsContent() {
        when(repository.findBySlug("home")).thenReturn(Optional.empty());
        when(repository.save(any(PageDocument.class))).thenAnswer(call -> call.getArgument(0));
        var content = Map.<String, Object>ofEntries(
                Map.entry("about_section_label", "01 / Experience"),
                Map.entry("about_company", "Taiwan Murata"),
                Map.entry("about_eyebrow", "About / Manufacturing DX"),
                Map.entry("about_heading", "I build internal AI tools for manufacturing teams."),
                Map.entry("about_role_label", "Current role"),
                Map.entry("about_role", "Digital Transformation Specialist"),
                Map.entry("about_summary", "Operational needs into usable applications."),
                Map.entry("about_perspective", "Understand the process before choosing a model."),
                Map.entry("about_projects_label", "Selected work projects"),
                Map.entry("about_projects_note", "Only public project details."),
                Map.entry("about_evidence_label", "Selected work"),
                Map.entry("case_01_title", "RAG knowledge application"),
                Map.entry("case_01_body", "Evaluated answer quality."),
                Map.entry("proof_01_title", "Internal knowledge assistant"),
                Map.entry("proof_01_value", "100+"),
                Map.entry("skills_eyebrow", "Capabilities"),
                Map.entry("skills_intro", "AI applications, data access, and workflows."),
                Map.entry("skill_group_ai_label", "AI / LLM"),
                Map.entry("skill_group_ai_tags", "RAG · Dify"),
                Map.entry("skill_group_ai_core", "RAG"),
                Map.entry("skill_group_ai_production", "RAG"),
                Map.entry("stage_1_problem", "文件太多，答案難找"),
                Map.entry("stage_1_title", "Internal AI apps"),
                Map.entry("stage_1_evidence", "已上線"),
                Map.entry("stage_1_tools", "RAG · agents · evaluation"));
        var request = new PageRequest("首頁", 0L, List.of(
                new PageBlockRequest("editorial-default", "editorial", true, content)));
        var result = new PageService(repository).update("home", request);
        assertThat(result.blocks().getFirst().content()).containsAllEntriesOf(content);
    }

    @Test
    void rejectsUnexpectedEditorialField() {
        var request = new PageRequest("首頁", 0L, List.of(
                new PageBlockRequest("editorial-default", "editorial", true, Map.of("unsafe_html", "<script>"))));
        assertThatThrownBy(() -> new PageService(repository).update("home", request))
                .isInstanceOf(IllegalArgumentException.class);
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
