package com.happywecan.portfolio.page.domain;

import java.util.LinkedHashMap;
import java.util.Map;

public class PageBlock {
    private String id;
    private String type;
    private boolean enabled;
    private Map<String, Object> content = new LinkedHashMap<>();

    protected PageBlock() {}
    public PageBlock(String id, String type, boolean enabled, Map<String, Object> content) {
        this.id = id;
        this.type = type;
        this.enabled = enabled;
        this.content = content == null ? new LinkedHashMap<>() : new LinkedHashMap<>(content);
    }
    public String getId() { return id; }
    public String getType() { return type; }
    public boolean isEnabled() { return enabled; }
    public Map<String, Object> getContent() { return Map.copyOf(content); }
}
