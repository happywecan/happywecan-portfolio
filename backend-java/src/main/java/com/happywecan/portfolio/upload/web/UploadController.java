package com.happywecan.portfolio.upload.web;

import java.util.Map;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.happywecan.portfolio.upload.service.UploadService;

@RestController
@RequestMapping("/api")
public class UploadController {
    private final UploadService service;
    public UploadController(UploadService service) { this.service = service; }
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public Map<String, String> upload(@RequestPart("file") MultipartFile file) {
        return Map.of("file_path", service.save(file));
    }
}
