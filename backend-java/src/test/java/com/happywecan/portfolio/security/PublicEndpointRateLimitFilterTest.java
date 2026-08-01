package com.happywecan.portfolio.security;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;

class PublicEndpointRateLimitFilterTest {
    @Test
    void limitsSensitivePublicPostEndpointsPerClient() throws Exception {
        PublicEndpointRateLimitFilter filter = new PublicEndpointRateLimitFilter(2);

        assertThat(invoke(filter).getStatus()).isEqualTo(200);
        assertThat(invoke(filter).getStatus()).isEqualTo(200);
        MockHttpServletResponse limited = invoke(filter);
        assertThat(limited.getStatus()).isEqualTo(429);
        assertThat(limited.getContentAsString()).contains("Too many requests");
    }

    private MockHttpServletResponse invoke(PublicEndpointRateLimitFilter filter) throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/contactme");
        request.setRemoteAddr("192.0.2.10");
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, new MockFilterChain());
        return response;
    }
}
