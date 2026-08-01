package com.happywecan.portfolio.newsletter.web;

import java.util.Map;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.happywecan.portfolio.newsletter.domain.NewsletterSubscriberDocument;
import com.happywecan.portfolio.newsletter.service.NewsletterService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class NewsletterController {
    private final NewsletterService service;
    public NewsletterController(NewsletterService service) { this.service = service; }
    @PostMapping("/subscribe") @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> subscribe(@Valid @RequestBody NewsletterRequest request) {
        NewsletterSubscriberDocument saved = service.subscribe(request);
        return Map.of("success", true, "message", "Subscription successful. Thanks for following.",
                "subscriber_id", saved.id());
    }

    @GetMapping("/subscribers")
    public List<NewsletterResponse> findAll() {
        return service.findAll();
    }

    @PatchMapping("/subscribers/{id}")
    public NewsletterResponse setActive(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        if (!body.containsKey("active")) throw new IllegalArgumentException("active is required");
        return service.setActive(id, body.get("active"));
    }

    @DeleteMapping("/subscribers/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
