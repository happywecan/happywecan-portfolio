package com.happywecan.portfolio.page.web;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import com.happywecan.portfolio.page.service.PageService;
import com.happywecan.portfolio.security.SecurityConfig;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PageController.class)
@Import(SecurityConfig.class)
class PageSecurityTest {
    @Autowired private MockMvc mockMvc;
    @MockitoBean private PageService service;

    @Test
    void publicCanReadPage() throws Exception {
        when(service.findBySlug("home")).thenReturn(new PageResponse(null, "home", "首頁", 0L, List.of(), null));
        mockMvc.perform(get("/api/pages/home")).andExpect(status().isOk());
    }

    @Test
    void anonymousUserCannotUpdatePage() throws Exception {
        mockMvc.perform(put("/api/pages/home").contentType("application/json")
                .content("{\"title\":\"首頁\",\"blocks\":[]}"))
                .andExpect(status().isUnauthorized());
    }
    @Test
    void anonymousUserCannotReadRevisions() throws Exception {
        mockMvc.perform(get("/api/pages/home/revisions")).andExpect(status().isUnauthorized());
    }
}
