package com.happywecan.portfolio.skill.service;

import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import com.happywecan.portfolio.shared.error.InvalidIdException;
import com.happywecan.portfolio.shared.error.ResourceNotFoundException;
import com.happywecan.portfolio.skill.domain.SkillDocument;
import com.happywecan.portfolio.skill.repository.SkillRepository;
import com.happywecan.portfolio.skill.web.SkillRequest;
import com.happywecan.portfolio.skill.web.SkillResponse;

@Service
public class SkillService {
    private final SkillRepository repository;
    public SkillService(SkillRepository repository) { this.repository = repository; }
    public List<SkillResponse> findAll() {
        return repository.findAll().stream().map(SkillResponse::from).toList();
    }
    public SkillResponse create(SkillRequest request) {
        return SkillResponse.from(repository.save(new SkillDocument(null, request.icon(), request.main(), request.subSkills())));
    }
    public SkillResponse update(String id, SkillRequest request) {
        validate(id);
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Skill", id);
        return SkillResponse.from(repository.save(new SkillDocument(id, request.icon(), request.main(), request.subSkills())));
    }
    public void delete(String id) {
        validate(id);
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Skill", id);
        repository.deleteById(id);
    }
    private void validate(String id) {
        if (!ObjectId.isValid(id)) throw new InvalidIdException("skill", id);
    }
}
