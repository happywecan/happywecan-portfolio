package com.happywecan.portfolio.skill.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.happywecan.portfolio.skill.domain.SkillDocument;

public interface SkillRepository extends MongoRepository<SkillDocument, String> {
}
