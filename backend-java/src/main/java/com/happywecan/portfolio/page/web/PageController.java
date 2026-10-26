package com.happywecan.portfolio.page.web;

import java.util.List;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.happywecan.portfolio.page.service.PageService;
import com.happywecan.portfolio.page.domain.PageRevision;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;

@Validated
@RestController
@RequestMapping("/api/pages")
public class PageController {
    private final PageService service;
    public PageController(PageService service) { this.service = service; }
    @GetMapping("/{slug}")
    public PageResponse find(@PathVariable @Pattern(regexp = "[a-z0-9-]{1,60}") String slug) {
        return service.findBySlug(slug);
    }
    @PutMapping("/{slug}")
    public PageResponse update(@PathVariable @Pattern(regexp = "[a-z0-9-]{1,60}") String slug,
            @Valid @RequestBody PageRequest request) {
        return service.update(slug, request);
    }
    @GetMapping("/{slug}/revisions")
    public List<PageRevision> revisions(@PathVariable @Pattern(regexp = "[a-z0-9-]{1,60}") String slug) {
        return service.revisions(slug);
    }
    @PostMapping("/{slug}/restore/{version}")
    public PageResponse restore(@PathVariable @Pattern(regexp = "[a-z0-9-]{1,60}") String slug,
            @PathVariable long version, @Valid @RequestBody RestoreRequest request) {
        return service.restore(slug, version, request.currentVersion());
    }
    public record RestoreRequest(@jakarta.validation.constraints.NotNull Long currentVersion) {}
}
