package com.happywecan.portfolio;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class HealthControllerTest {

    private final HealthController controller = new HealthController();

    @Test
    void returnsOkStatus() {
        HealthResponse response = controller.health();

        assertThat(response.status()).isEqualTo("ok");
    }
}
