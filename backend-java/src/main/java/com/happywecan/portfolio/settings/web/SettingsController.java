package com.happywecan.portfolio.settings.web;

import java.util.Map;
import org.springframework.web.bind.annotation.*;
import com.happywecan.portfolio.settings.service.SettingsService;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {
    private final SettingsService service;
    public SettingsController(SettingsService service) { this.service = service; }
    @GetMapping("/hero") public Map<String, Object> getHero() { return service.getHero(); }
    @PutMapping("/hero") public Map<String, Object> updateHero(@RequestBody Map<String, Object> values) {
        return service.updateHero(values);
    }
    @GetMapping("/site") public Map<String, Object> getSite() { return service.getSite(); }
    @PutMapping("/site") public Map<String, Object> updateSite(@RequestBody Map<String, Object> values) {
        return service.updateSite(values);
    }
}
