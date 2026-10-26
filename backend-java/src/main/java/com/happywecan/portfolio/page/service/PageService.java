package com.happywecan.portfolio.page.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashSet;
import java.util.Set;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import com.happywecan.portfolio.shared.error.ConflictException;
import com.happywecan.portfolio.shared.error.ResourceNotFoundException;
import com.happywecan.portfolio.page.domain.PageBlock;
import com.happywecan.portfolio.page.domain.PageDocument;
import com.happywecan.portfolio.page.domain.PageRevision;
import com.happywecan.portfolio.page.repository.PageRepository;
import com.happywecan.portfolio.page.web.PageRequest;
import com.happywecan.portfolio.page.web.PageResponse;

@Service
public class PageService {
    private static final Set<String> EDITORIAL_FIELDS = Set.of(
            "hero_main_title", "hero_subtitle", "hero_bio_content", "hero_button_1_label",
            "hero_button_2_label", "hero_resume_label", "hero_background_image_url", "hero_personal_photo_url",
            "about_section_label", "about_company", "about_eyebrow", "about_heading", "about_role_label",
            "about_role", "about_summary", "about_perspective", "about_projects_label", "about_projects_note",
            "about_evidence_label", "about_resume_label",
            "skills_eyebrow", "skills_heading", "skills_intro", "skills_caption",
            "portfolio_eyebrow", "portfolio_title", "products_eyebrow", "products_heading",
            "blog_title", "blog_description",
            "contact_title", "contact_intro", "contact_email", "contact_location_label",
            "contact_location", "contact_name_label", "contact_name_placeholder",
            "contact_email_label", "contact_email_placeholder", "contact_message_label",
            "contact_message_placeholder", "contact_submit_label", "contact_submitting_label",
            "contact_socials_label", "contact_footer_note", "contact_footer_stack", "contact_local_time_label");
    private final PageRepository repository;
    public PageService(PageRepository repository) { this.repository = repository; }
    public PageResponse findBySlug(String slug) {
        requireHome(slug);
        return PageResponse.from(repository.findBySlug(slug).orElseGet(() -> createDefault(slug)));
    }
    public PageResponse update(String slug, PageRequest request) {
        requireHome(slug);
        validate(request);
        List<PageBlock> blocks = request.blocks().stream()
                .map(block -> new PageBlock(block.id(), block.type(), block.enabled(), block.content()))
                .toList();
        PageDocument document = repository.findBySlug(slug).orElse(null);
        if (document == null) {
            if (request.version() != 0) throw new ConflictException("頁面已變更，請重新載入");
            document = new PageDocument(null, slug, request.title(), blocks, LocalDateTime.now());
        } else {
            if (!document.getVersion().equals(request.version())) throw new ConflictException("頁面已被更新，請重新載入後再編輯");
            document.update(request.title(), blocks, LocalDateTime.now());
        }
        try { return PageResponse.from(repository.save(document)); }
        catch (OptimisticLockingFailureException ex) { throw new ConflictException("頁面已被更新，請重新載入後再編輯"); }
    }
    public List<PageRevision> revisions(String slug) {
        requireHome(slug);
        return repository.findBySlug(slug).map(PageDocument::getRevisions).orElse(List.of());
    }
    public PageResponse restore(String slug, long revisionVersion, long currentVersion) {
        requireHome(slug);
        PageDocument document = repository.findBySlug(slug).orElseThrow(() -> new ResourceNotFoundException("Page", slug));
        if (!document.getVersion().equals(currentVersion)) throw new ConflictException("頁面已被更新，請重新載入後再復原");
        PageRevision revision = document.getRevisions().stream().filter(item -> item.version() == revisionVersion)
                .findFirst().orElseThrow(() -> new ResourceNotFoundException("Revision", Long.toString(revisionVersion)));
        document.update(revision.title(), revision.blocks(), LocalDateTime.now());
        try { return PageResponse.from(repository.save(document)); }
        catch (OptimisticLockingFailureException ex) { throw new ConflictException("頁面已被更新，請重新載入後再復原"); }
    }
    private void requireHome(String slug) {
        if (!"home".equals(slug)) throw new ResourceNotFoundException("Page", slug);
    }
    private void validate(PageRequest request) {
        Set<String> ids = new HashSet<>();
        int totalCharacters = 0;
        for (var block : request.blocks()) {
            if (!ids.add(block.id())) throw new IllegalArgumentException("區塊 ID 不可重複");
            Map<String, Object> content = block.content();
            if (content.size() > ("editorial".equals(block.type()) ? 120 : 12))
                throw new IllegalArgumentException("區塊欄位過多");
            Set<String> allowed = switch (block.type()) {
                case "rich_text" -> Set.of("eyebrow", "title", "body");
                case "image_text" -> Set.of("eyebrow", "title", "body", "image_url", "image_alt", "image_side");
                case "cta" -> Set.of("title", "body", "button_label", "button_url");
                case "spacer" -> Set.of("size");
                default -> Set.of();
            };
            for (var entry : content.entrySet()) {
                if (!(allowed.contains(entry.getKey()) || ("editorial".equals(block.type()) && editorialField(entry.getKey())))
                        || !(entry.getValue() instanceof String value) || value.length() > 10000)
                    throw new IllegalArgumentException("區塊欄位無效：" + entry.getKey());
                totalCharacters += value.length();
                if ("editorial".equals(block.type())) validateEditorialValue(entry.getKey(), value);
            }
            if (Set.of("rich_text", "image_text", "cta").contains(block.type())) required(content, "title");
            if ("image_text".equals(block.type())) {
                String image = string(content, "image_url");
                if (!image.isBlank()) {
                    if (!image.matches("(?i)https?://[^\\s]+|/static/[^\\s]+")) throw new IllegalArgumentException("圖片網址無效");
                    required(content, "image_alt");
                }
                if (!Set.of("", "left", "right").contains(string(content, "image_side"))) throw new IllegalArgumentException("圖片位置無效");
            }
            if ("cta".equals(block.type())) {
                required(content, "button_label"); required(content, "button_url");
                String url = string(content, "button_url");
                if (!url.matches("(?i)(https?://[^\\s]+|mailto:[^\\s]+|/(?!/)[^\\s]*|#[^\\s]+)"))
                    throw new IllegalArgumentException("按鈕連結無效");
            }
            if ("spacer".equals(block.type()) && !Set.of("small", "medium", "large").contains(string(content, "size")))
                throw new IllegalArgumentException("留白高度無效");
        }
        if (totalCharacters > 100000) throw new IllegalArgumentException("頁面內容過長");
    }
    private boolean editorialField(String key) {
        return EDITORIAL_FIELDS.contains(key)
                || key.matches("proof_0[1-3]_(status|title|value|label|detail)")
                || key.matches("stage_[1-3]_(problem|title|body|evidence|tools)")
                || key.matches("skill_group_(ai|backend|data|devops|automation|frontend)_(label|tags|core|production)")
                || key.matches("case_0[1-2]_(label|title|body|tags)")
                || key.matches("product_[1-3]_(title|body)")
                || key.matches("threads_post_[1-3]_url");
    }
    private void validateEditorialValue(String key, String value) {
        if (key.matches("hero_(background_image|personal_photo)_url") && !value.isBlank()
                && !value.matches("(?i)(https?://[^\\s]+|/static/[^\\s]+)"))
            throw new IllegalArgumentException("圖片網址無效");
        if (key.matches("threads_post_[1-3]_url") && !value.matches("https://(www\\.)?threads\\.com/@[^/]+/post/[A-Za-z0-9_-]+/?"))
            throw new IllegalArgumentException("Threads 網址無效");
    }
    private String string(Map<String, Object> content, String key) { return (String) content.getOrDefault(key, ""); }
    private void required(Map<String, Object> content, String key) {
        if (string(content, key).isBlank()) throw new IllegalArgumentException("缺少必填欄位：" + key);
    }
    private PageDocument createDefault(String slug) {
        String title = "home".equals(slug) ? "首頁" : slug;
        List<PageBlock> blocks = "home".equals(slug)
                ? List.of(new PageBlock("editorial-default", "editorial", true, Map.of()))
                : List.of();
        return repository.save(new PageDocument(null, slug, title, blocks, LocalDateTime.now()));
    }
}
