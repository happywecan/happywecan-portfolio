package com.happywecan.portfolio.page.domain;

import java.time.LocalDateTime;
import java.util.List;

public record PageRevision(Long version, String title, List<PageBlock> blocks, LocalDateTime publishedAt) {}
