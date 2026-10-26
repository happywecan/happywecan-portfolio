package com.happywecan.portfolio.page.web;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.happywecan.portfolio.page.domain.PageDocument;

public record PageResponse(String id, String slug, String title, Long version, List<BlockResponse> blocks,
        @JsonProperty("updated_at") LocalDateTime updatedAt) {
    public static PageResponse from(PageDocument document) {
        return new PageResponse(document.getId(), document.getSlug(), document.getTitle(), document.getVersion(),
                document.getBlocks().stream()
                        .map(block -> new BlockResponse(block.getId(), block.getType(), block.isEnabled(), block.getContent()))
                        .toList(), document.getUpdatedAt());
    }
    public record BlockResponse(String id, String type, boolean enabled, Map<String, Object> content) {}
}
