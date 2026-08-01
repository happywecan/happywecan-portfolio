package com.happywecan.portfolio;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/healthz")
    public HealthResponse health() {
        return new HealthResponse("ok");
    }
}
