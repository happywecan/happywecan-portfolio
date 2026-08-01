package com.happywecan.portfolio.settings.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.happywecan.portfolio.shared.error.InvalidIdException;

@Service
public class SettingsService {
    private static final String COLLECTION = "settings";
    private final MongoTemplate mongoTemplate;

    public SettingsService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public Map<String, Object> getHero() {
        return getOrCreate("hero_settings", heroDefaults());
    }

    public Map<String, Object> getSite() {
        return getOrCreate("site_settings", siteDefaults());
    }

    public Map<String, Object> updateHero(Map<String, Object> values) {
        return update("hero_settings", values);
    }

    public Map<String, Object> updateSite(Map<String, Object> values) {
        return update("site_settings", values);
    }

    private Map<String, Object> getOrCreate(String settingsId, Map<String, Object> defaults) {
        Query query = Query.query(Criteria.where("settings_id").is(settingsId));
        Document found = mongoTemplate.findOne(query, Document.class, COLLECTION);
        if (found == null) {
            found = new Document(defaults);
            mongoTemplate.insert(found, COLLECTION);
        }
        return normalized(found);
    }

    private Map<String, Object> update(String expectedId, Map<String, Object> values) {
        if (!expectedId.equals(values.get("settings_id"))) {
            throw new InvalidIdException("settings", String.valueOf(values.get("settings_id")));
        }
        Map<String, Object> safe = new LinkedHashMap<>(values);
        safe.remove("_id");
        Update update = new Update();
        safe.forEach(update::set);
        Document result = mongoTemplate.findAndModify(
                Query.query(Criteria.where("settings_id").is(expectedId)),
                update,
                org.springframework.data.mongodb.core.FindAndModifyOptions.options().returnNew(true).upsert(true),
                Document.class,
                COLLECTION);
        return normalized(result);
    }

    private Map<String, Object> normalized(Document document) {
        Map<String, Object> result = new LinkedHashMap<>(document);
        Object id = result.get("_id");
        if (id != null) result.put("_id", id.toString());
        return result;
    }

    private Map<String, Object> heroDefaults() {
        Map<String, Object> values = new LinkedHashMap<>();
        values.put("settings_id", "hero_settings");
        values.put("hero_background_image_url", null);
        values.put("hero_personal_photo_url", "/placeholder.svg");
        values.put("hero_main_title", "Angelo Developer");
        values.put("hero_subtitle", "Creative Developer");
        values.put("hero_bio_content", "Based in Taiwan, building thoughtful digital products.");
        values.put("hero_button_1_label", "View Work");
        values.put("hero_button_2_label", "Contact Me");
        return values;
    }

    private Map<String, Object> siteDefaults() {
        Map<String, Object> values = new LinkedHashMap<>();
        values.put("settings_id", "site_settings");
        values.put("contact_email", "");
        values.put("contact_phone", "");
        values.put("contact_location", "Taiwan");
        values.put("social_github", "");
        values.put("social_instagram", "");
        values.put("social_youtube", "");
        values.put("portfolio_title", "Selected Work");
        values.put("portfolio_subtitle", "A collection of projects exploring the intersection of design, code, and interaction.");
        values.put("blog_title", "Insights");
        values.put("nav_brand_primary", "Angelo");
        values.put("nav_brand_secondary", "Studio");
        values.put("nav_mobile_caption", "Product-minded frontend, full-stack implementation, and writing from Taiwan.");
        values.put("nav_home_label", "Home");
        values.put("nav_about_label", "About");
        values.put("nav_skills_label", "Skills");
        values.put("nav_portfolio_label", "Work");
        values.put("nav_blog_label", "Blog");
        values.put("nav_contact_label", "Contact");
        values.put("intro_splash_enabled", true);
        values.put("intro_splash_keywords", "Java, Spring Boot, Next.js, React");
        values.put("section_hero_enabled", true);
        values.put("section_hero_order", 1);
        values.put("section_about_enabled", true);
        values.put("section_about_order", 2);
        values.put("section_skills_enabled", true);
        values.put("section_skills_order", 3);
        values.put("section_portfolio_enabled", true);
        values.put("section_portfolio_order", 4);
        values.put("section_blog_enabled", true);
        values.put("section_blog_order", 5);
        values.put("section_contact_enabled", true);
        values.put("section_contact_order", 6);
        values.put("about_image_url", "/placeholder.svg");
        values.put("about_eyebrow", "About / Positioning");
        values.put("about_title", "Full-stack Java and React Engineer");
        values.put("about_summary", "I connect product needs, backend systems, automation, and thoughtful interfaces.");
        values.put("about_body", "This site is a living full-stack project built with Spring Boot, MongoDB, Next.js, and React.");
        values.put("about_photo_caption", "Building from business workflow to production-ready system detail");
        values.put("stat_1_value", "Java");
        values.put("stat_1_label", "Backend");
        values.put("stat_2_value", "React");
        values.put("stat_2_label", "Frontend");
        values.put("stat_3_value", "DX");
        values.put("stat_3_label", "Product direction");
        values.put("focus_1_label", "Backend");
        values.put("focus_1_title", "Reliable application services");
        values.put("focus_1_body", "Spring MVC, validation, MongoDB, testing, and maintainable application boundaries.");
        values.put("focus_2_label", "Security");
        values.put("focus_2_title", "Protected administration");
        values.put("focus_2_body", "JWT, bcrypt, default-deny access rules, upload validation, and environment-based secrets.");
        values.put("focus_3_label", "Frontend");
        values.put("focus_3_title", "Product-quality interfaces");
        values.put("focus_3_body", "Next.js, React, TypeScript, responsive layouts, motion, and accessible content.");
        values.put("skills_eyebrow", "Stack index");
        values.put("skills_title", "Skills");
        values.put("skills_stack_label", "Primary stack");
        values.put("skills_core_stack", "Java, Spring Boot, Maven, Next.js, React, TypeScript, MongoDB, Docker");
        values.put("skills_default_description", "Tools and practices used to turn ideas into maintainable shipped work.");
        values.put("skills_frontend_description", "Interfaces, component systems, motion, and responsive product screens.");
        values.put("skills_backend_description", "API design, data modeling, authentication, and operational reliability.");
        values.put("skills_collaboration_description", "Documentation, handoff quality, product thinking, and team workflows.");
        values.put("skills_analytics_description", "Performance, measurement, iteration, and decision support.");
        values.put("portfolio_kicker", "Portfolio / selected case studies / shipped work");
        values.put("portfolio_empty_eyebrow", "Portfolio library");
        values.put("portfolio_empty_title", "Case studies are ready for your first projects.");
        values.put("portfolio_empty_body", "Add work from the admin panel with a problem, role, process, stack, result, and links.");
        values.put("portfolio_item_button_label", "View");
        values.put("portfolio_default_tag", "Development");
        values.put("blog_subtitle", "Technical notes, product decisions, and lessons worth keeping.");
        values.put("blog_empty_eyebrow", "Journal system");
        values.put("blog_empty_title", "The writing shelf is ready.");
        values.put("blog_empty_body", "Use the admin panel to publish notes about Java, Spring Boot, Next.js, and engineering decisions.");
        values.put("blog_item_button_label", "Read");
        values.put("blog_draft_label", "Draft");
        values.put("detail_blog_back_label", "Back to journal");
        values.put("detail_blog_eyebrow", "Journal");
        values.put("detail_blog_not_found", "Article not found");
        values.put("detail_portfolio_back_label", "Back to portfolio");
        values.put("detail_portfolio_eyebrow", "Case study");
        values.put("detail_portfolio_not_found", "Project not found");
        values.put("contact_title", "Contact");
        values.put("contact_intro_label", "Get in touch");
        values.put("contact_location_label", "Location");
        values.put("contact_name_label", "01 / What's your name?");
        values.put("contact_name_placeholder", "NAME");
        values.put("contact_email_label", "02 / What's your email?");
        values.put("contact_email_placeholder", "EMAIL");
        values.put("contact_message_label", "03 / Your message");
        values.put("contact_message_placeholder", "MESSAGE");
        values.put("contact_submit_label", "Send");
        values.put("contact_submitting_label", "Sending");
        values.put("contact_socials_label", "Socials");
        values.put("contact_footer_note", "© 2026 Angelo — Created with Passion");
        values.put("contact_footer_stack", "Built with Java, Spring Boot, Next.js & React");
        values.put("contact_local_time_label", "Local Time");
        return values;
    }
}
