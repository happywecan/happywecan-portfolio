package com.happywecan.portfolio.hobby.service;

import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import com.happywecan.portfolio.hobby.domain.HobbyDocument;
import com.happywecan.portfolio.hobby.repository.HobbyRepository;
import com.happywecan.portfolio.hobby.web.HobbyRequest;
import com.happywecan.portfolio.hobby.web.HobbyResponse;
import com.happywecan.portfolio.shared.error.InvalidIdException;
import com.happywecan.portfolio.shared.error.ResourceNotFoundException;

@Service
public class HobbyService {
    private final HobbyRepository repository;
    public HobbyService(HobbyRepository repository) { this.repository = repository; }
    public List<HobbyResponse> findAll() { return repository.findAll().stream().map(HobbyResponse::from).toList(); }
    public HobbyResponse create(HobbyRequest request) {
        return HobbyResponse.from(repository.save(new HobbyDocument(null, request.name(), request.icon(), request.description())));
    }
    public HobbyResponse update(String id, HobbyRequest request) {
        validate(id);
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Hobby", id);
        return HobbyResponse.from(repository.save(new HobbyDocument(id, request.name(), request.icon(), request.description())));
    }
    public void delete(String id) {
        validate(id);
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Hobby", id);
        repository.deleteById(id);
    }
    private void validate(String id) { if (!ObjectId.isValid(id)) throw new InvalidIdException("hobby", id); }
}
