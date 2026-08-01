package com.happywecan.portfolio.skill.domain;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "skills")
public record SkillDocument(@Id String id, String icon, String main, List<String> subSkills) {
}
