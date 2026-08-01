package com.happywecan.portfolio.blog.web;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.happywecan.portfolio.blog.service.BlogPostService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/blog")
public class BlogPostController {
    private final BlogPostService service;
    public BlogPostController(BlogPostService service) { this.service = service; }
    @GetMapping public List<BlogPostResponse> findPublic() {
        return service.findPublic();
    }
    @GetMapping("/all") public List<BlogPostResponse> findAllAdmin() { return service.findAllAdmin(); }
    @GetMapping("/count") public Map<String, Long> count() {
        return Map.of("count", service.countPublic());
    }
    @GetMapping("/{id}") public BlogPostResponse findById(@PathVariable String id) {
        return service.findPublicById(id);
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public BlogPostResponse create(@Valid @RequestBody BlogPostRequest request) { return service.create(request); }
    @PutMapping("/{id}")
    public BlogPostResponse update(@PathVariable String id, @Valid @RequestBody BlogPostRequest request) {
        return service.update(id, request);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) { service.delete(id); }
}
