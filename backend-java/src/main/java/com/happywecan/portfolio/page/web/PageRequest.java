package com.happywecan.portfolio.page.web;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PageRequest(
        @NotBlank @Size(max = 120) String title,
        @NotNull Long version,
        @NotNull @Size(max = 40) List<@Valid PageBlockRequest> blocks) {}
