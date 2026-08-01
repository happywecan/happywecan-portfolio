package com.happywecan.portfolio.skill.web;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.happywecan.portfolio.skill.service.SkillService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/skills")
public class SkillController {
    private final SkillService service;
    public SkillController(SkillService service) { this.service = service; }
    @GetMapping public List<SkillResponse> findAll() { return service.findAll(); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public SkillResponse create(@Valid @RequestBody SkillRequest request) { return service.create(request); }
    @PutMapping("/{id}")
    public SkillResponse update(@PathVariable String id, @Valid @RequestBody SkillRequest request) {
        return service.update(id, request);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) { service.delete(id); }
}
