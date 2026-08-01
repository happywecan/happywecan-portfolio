package com.happywecan.portfolio.portfolio.web;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.happywecan.portfolio.portfolio.domain.PortfolioLink;
import com.happywecan.portfolio.portfolio.service.PortfolioService;
import com.happywecan.portfolio.shared.error.GlobalExceptionHandler;
import com.happywecan.portfolio.shared.error.InvalidPortfolioIdException;
import com.happywecan.portfolio.shared.error.PortfolioNotFoundException;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PortfolioController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class PortfolioControllerTest {

    private static final String VALID_ID = "507f1f77bcf86cd799439011";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PortfolioService service;

    @Test
    void keepsTheExistingFrontendJsonContract() throws Exception {
        when(service.findAll()).thenReturn(List.of(sampleResponse()));

        mockMvc.perform(get("/api/portfolio"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(VALID_ID))
                .andExpect(jsonPath("$[0].title").value("Java migration"))
                .andExpect(jsonPath("$[0].image_url").value("/static/uploads/java.png"))
                .andExpect(jsonPath("$[0].github_url").value("https://github.com/example/project"))
                .andExpect(jsonPath("$[0].demo_url").value("https://example.com"))
                .andExpect(jsonPath("$[0].created_at").value("2026-07-25T10:00:00"))
                .andExpect(jsonPath("$[0].tags[0]").value("Java"));
    }

    @Test
    void returnsBadRequestWithDetailForInvalidId() throws Exception {
        when(service.findById("invalid"))
                .thenThrow(new InvalidPortfolioIdException("invalid"));

        mockMvc.perform(get("/api/portfolio/invalid"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.detail").value("Invalid portfolio id: invalid"));
    }

    @Test
    void returnsNotFoundWithDetailForMissingPortfolio() throws Exception {
        when(service.findById(VALID_ID))
                .thenThrow(new PortfolioNotFoundException(VALID_ID));

        mockMvc.perform(get("/api/portfolio/{id}", VALID_ID))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.detail").value("Portfolio item not found: " + VALID_ID));
    }

    private PortfolioResponse sampleResponse() {
        return new PortfolioResponse(
                VALID_ID,
                "Java migration",
                "Moving the portfolio API to Spring Boot",
                "# Details",
                "/static/uploads/java.png",
                "https://github.com/example/project",
                "https://example.com",
                List.of(new PortfolioLink("Live site", "https://example.com")),
                List.of("Java", "Spring Boot"),
                LocalDateTime.of(2026, 7, 25, 10, 0),
                null);
    }
}
