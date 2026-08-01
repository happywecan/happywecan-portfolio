package com.happywecan.portfolio.contact.web;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.happywecan.portfolio.contact.domain.ContactDocument;
import com.happywecan.portfolio.contact.service.ContactService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class ContactController {
    private final ContactService service;
    public ContactController(ContactService service) { this.service = service; }
    @PostMapping("/contactme") @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> submit(@Valid @RequestBody ContactRequest request) {
        ContactDocument saved = service.submit(request);
        return Map.of("success", true, "message",
                "Your message has been sent. I will get back to you soon.", "contact_id", saved.id());
    }
    @GetMapping("/contacts")
    public List<ContactResponse> findAll(@RequestParam(defaultValue = "200") int limit) {
        return service.findAll(Math.max(1, Math.min(limit, 1000)));
    }
    @PatchMapping("/contacts/{id}")
    public ContactResponse update(@PathVariable String id, @RequestBody ContactStatusRequest request) {
        return service.updateStatus(id, request);
    }
    @DeleteMapping("/contacts/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) { service.delete(id); }
}
