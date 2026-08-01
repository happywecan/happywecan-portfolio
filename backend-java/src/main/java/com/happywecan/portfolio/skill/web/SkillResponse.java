package com.happywecan.portfolio.skill.web;

import java.util.List;
import com.happywecan.portfolio.skill.domain.SkillDocument;

public record SkillResponse(String id, String icon, String main, List<String> subSkills) {
    public static SkillResponse from(SkillDocument value) {
        return new SkillResponse(value.id(), value.icon(), value.main(),
                value.subSkills() == null ? List.of() : value.subSkills());
    }
}
