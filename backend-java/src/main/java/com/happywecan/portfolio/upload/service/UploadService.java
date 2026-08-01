package com.happywecan.portfolio.upload.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.io.InputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadService {
    private static final Map<String, String> EXTENSIONS = Map.of(
            "image/jpeg", ".jpg", "image/png", ".png", "image/webp", ".webp", "image/gif", ".gif");
    private static final Set<String> ORIGINAL_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".webp", ".gif");
    private final Path uploadDirectory;
    private final long maxBytes;

    public UploadService(@Value("${app.upload.directory}") String directory,
            @Value("${app.upload.max-bytes}") long maxBytes) {
        this.uploadDirectory = Path.of(directory).toAbsolutePath().normalize();
        this.maxBytes = maxBytes;
    }

    public String save(MultipartFile file) {
        if (file.isEmpty()) throw new IllegalArgumentException("Image file is required");
        if (file.getSize() > maxBytes) throw new UploadTooLargeException("File must be 5MB or smaller");
        String contentType = file.getContentType();
        if (!EXTENSIONS.containsKey(contentType)) {
            throw new IllegalArgumentException("Only JPEG, PNG, WebP, and GIF images are allowed");
        }
        if (!hasValidSignature(file, contentType)) {
            throw new IllegalArgumentException("Uploaded content does not match its image type");
        }
        String original = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        if (ORIGINAL_EXTENSIONS.stream().noneMatch(original::endsWith)) {
            throw new IllegalArgumentException("Image filename has an unsupported extension");
        }
        try {
            Files.createDirectories(uploadDirectory);
            String filename = UUID.randomUUID() + EXTENSIONS.get(contentType);
            Path target = uploadDirectory.resolve(filename).normalize();
            if (!target.getParent().equals(uploadDirectory)) throw new IllegalArgumentException("Invalid upload path");
            file.transferTo(target);
            return "/static/uploads/" + filename;
        } catch (IOException exception) {
            throw new IllegalStateException("Could not save uploaded image", exception);
        }
    }

    public Path uploadDirectory() { return uploadDirectory; }

    private boolean hasValidSignature(MultipartFile file, String contentType) {
        try (InputStream input = file.getInputStream()) {
            byte[] header = input.readNBytes(12);
            return switch (contentType) {
                case "image/jpeg" -> header.length >= 3
                        && unsigned(header[0]) == 0xFF && unsigned(header[1]) == 0xD8 && unsigned(header[2]) == 0xFF;
                case "image/png" -> header.length >= 8
                        && unsigned(header[0]) == 0x89 && header[1] == 'P' && header[2] == 'N' && header[3] == 'G';
                case "image/gif" -> header.length >= 6
                        && header[0] == 'G' && header[1] == 'I' && header[2] == 'F' && header[3] == '8';
                case "image/webp" -> header.length >= 12
                        && header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F'
                        && header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P';
                default -> false;
            };
        } catch (IOException exception) {
            throw new IllegalStateException("Could not inspect uploaded image", exception);
        }
    }

    private int unsigned(byte value) {
        return value & 0xFF;
    }
}
