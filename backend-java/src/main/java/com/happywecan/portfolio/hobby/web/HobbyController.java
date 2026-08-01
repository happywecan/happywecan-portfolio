package com.happywecan.portfolio.hobby.web;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.happywecan.portfolio.hobby.service.HobbyService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/hobbies")
public class HobbyController {
    private final HobbyService service;
    public HobbyController(HobbyService service) { this.service = service; }
    @GetMapping public List<HobbyResponse> findAll() { return service.findAll(); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public HobbyResponse create(@Valid @RequestBody HobbyRequest request) { return service.create(request); }
    @PutMapping("/{id}")
    public HobbyResponse update(@PathVariable String id, @Valid @RequestBody HobbyRequest request) {
        return service.update(id, request);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) { service.delete(id); }
}
