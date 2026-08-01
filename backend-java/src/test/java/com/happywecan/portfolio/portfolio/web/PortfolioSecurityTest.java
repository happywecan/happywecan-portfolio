package com.happywecan.portfolio.portfolio.web;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import com.happywecan.portfolio.portfolio.service.PortfolioService;
import com.happywecan.portfolio.security.SecurityConfig;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PortfolioController.class)
@Import(SecurityConfig.class)
class PortfolioSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PortfolioService service;

    @Test
    void publicCanReadPortfolio() throws Exception {
        when(service.findAll()).thenReturn(List.of());
        mockMvc.perform(get("/api/portfolio")).andExpect(status().isOk());
    }

    @Test
    void anonymousUserCannotCreatePortfolio() throws Exception {
        mockMvc.perform(post("/api/portfolio")
                        .contentType("application/json")
                        .content("""
                                {"title":"Protected","description":"Must require JWT"}
                                """))
                .andExpect(status().isUnauthorized());
    }
}
