package com.happywecan.portfolio.skill.web;

import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SkillRequest(
        @NotBlank @Size(max = 80) String icon,
        @NotBlank @Size(max = 120) String main,
        List<@Size(max = 80) String> subSkills) {
}
