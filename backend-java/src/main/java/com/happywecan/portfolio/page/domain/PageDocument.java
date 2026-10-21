package com.happywecan.portfolio.page.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "pages")
public class PageDocument {
    @Id private String id;
    @Indexed(unique = true) private String slug;
    private String title;
    private List<PageBlock> blocks = new ArrayList<>();
    @Field("updated_at") private LocalDateTime updatedAt;
    @Version private Long version;
    private List<PageRevision> revisions = new ArrayList<>();

    protected PageDocument() {}
    public PageDocument(String id, String slug, String title, List<PageBlock> blocks, LocalDateTime updatedAt) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.blocks = blocks == null ? new ArrayList<>() : new ArrayList<>(blocks);
        this.updatedAt = updatedAt;
    }
    public String getId() { return id; }
    public String getSlug() { return slug; }
    public String getTitle() { return title; }
    public List<PageBlock> getBlocks() { return blocks == null ? List.of() : List.copyOf(blocks); }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public Long getVersion() { return version == null ? 0L : version; }
    public List<PageRevision> getRevisions() { return revisions == null ? List.of() : List.copyOf(revisions); }
    public void update(String title, List<PageBlock> blocks, LocalDateTime updatedAt) {
        if (revisions == null) revisions = new ArrayList<>();
        revisions.add(new PageRevision(getVersion(), this.title, getBlocks(), this.updatedAt));
        if (revisions.size() > 20) revisions.remove(0);
        this.title = title;
        this.blocks = new ArrayList<>(blocks);
        this.updatedAt = updatedAt;
    }
}
