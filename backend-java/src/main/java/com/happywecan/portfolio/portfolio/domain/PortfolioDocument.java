package com.happywecan.portfolio.portfolio.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "portfolio")
public class PortfolioDocument {

    @Id
    private String id;

    private String title;
    private String description;
    private String content;

    @Field("image_url")
    private String imageUrl;

    @Field("github_url")
    private String githubUrl;

    @Field("demo_url")
    private String demoUrl;

    private List<PortfolioLink> links = new ArrayList<>();
    private List<String> tags = new ArrayList<>();

    @Field("created_at")
    private LocalDateTime createdAt;

    @Field("updated_at")
    private LocalDateTime updatedAt;

    protected PortfolioDocument() {
    }

    public PortfolioDocument(
            String id,
            String title,
            String description,
            String content,
            String imageUrl,
            String githubUrl,
            String demoUrl,
            List<PortfolioLink> links,
            List<String> tags,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.content = content;
        this.imageUrl = imageUrl;
        this.githubUrl = githubUrl;
        this.demoUrl = demoUrl;
        this.links = links == null ? new ArrayList<>() : new ArrayList<>(links);
        this.tags = tags == null ? new ArrayList<>() : new ArrayList<>(tags);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getContent() {
        return content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public String getDemoUrl() {
        return demoUrl;
    }

    public List<PortfolioLink> getLinks() {
        return links == null ? List.of() : List.copyOf(links);
    }

    public List<String> getTags() {
        return tags == null ? List.of() : List.copyOf(tags);
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void update(
            String title,
            String description,
            String content,
            String imageUrl,
            String githubUrl,
            String demoUrl,
            List<PortfolioLink> links,
            List<String> tags,
            LocalDateTime updatedAt) {
        this.title = title;
        this.description = description;
        this.content = content;
        this.imageUrl = imageUrl;
        this.githubUrl = githubUrl;
        this.demoUrl = demoUrl;
        this.links = links == null ? new ArrayList<>() : new ArrayList<>(links);
        this.tags = tags == null ? new ArrayList<>() : new ArrayList<>(tags);
        this.updatedAt = updatedAt;
    }
}
