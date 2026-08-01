package com.happywecan.portfolio.upload.service;

import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UploadServiceTest {
    @TempDir Path tempDirectory;

    @Test
    void savesAllowedImageUsingGeneratedFilename() {
        UploadService service = new UploadService(tempDirectory.toString(), 1024);
        MockMultipartFile file = new MockMultipartFile("file", "photo.png", "image/png",
                new byte[]{(byte) 0x89, 'P', 'N', 'G', 13, 10, 26, 10});

        String path = service.save(file);

        assertThat(path).startsWith("/static/uploads/").endsWith(".png");
        assertThat(tempDirectory.resolve(path.substring("/static/uploads/".length()))).exists();
    }

    @Test
    void rejectsNonImageContentType() {
        UploadService service = new UploadService(tempDirectory.toString(), 1024);
        MockMultipartFile file = new MockMultipartFile("file", "script.html", "text/html", "<script/>".getBytes());
        assertThatThrownBy(() -> service.save(file)).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void rejectsFileWhoseBytesDoNotMatchDeclaredImageType() {
        UploadService service = new UploadService(tempDirectory.toString(), 1024);
        MockMultipartFile file = new MockMultipartFile(
                "file", "fake.png", "image/png", "<script>alert(1)</script>".getBytes());
        assertThatThrownBy(() -> service.save(file))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("does not match");
    }
}
