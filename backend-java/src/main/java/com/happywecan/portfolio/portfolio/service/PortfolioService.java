package com.happywecan.portfolio.portfolio.service;

import java.util.List;
import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.happywecan.portfolio.portfolio.repository.PortfolioRepository;
import com.happywecan.portfolio.portfolio.web.PortfolioResponse;
import com.happywecan.portfolio.portfolio.web.PortfolioRequest;
import com.happywecan.portfolio.portfolio.domain.PortfolioDocument;
import com.happywecan.portfolio.shared.error.InvalidPortfolioIdException;
import com.happywecan.portfolio.shared.error.PortfolioNotFoundException;

@Service
public class PortfolioService {

    private final PortfolioRepository repository;

    public PortfolioService(PortfolioRepository repository) {
        this.repository = repository;
    }

    public List<PortfolioResponse> findAll() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PortfolioResponse::from)
                .toList();
    }

    public PortfolioResponse findById(String id) {
        if (!ObjectId.isValid(id)) {
            throw new InvalidPortfolioIdException(id);
        }

        return repository.findById(id)
                .map(PortfolioResponse::from)
                .orElseThrow(() -> new PortfolioNotFoundException(id));
    }

    public PortfolioResponse create(PortfolioRequest request) {
        PortfolioDocument document = new PortfolioDocument(
                null,
                request.title(),
                request.description(),
                request.content(),
                request.imageUrl(),
                request.githubUrl(),
                request.demoUrl(),
                request.links(),
                request.tags(),
                LocalDateTime.now(),
                null);
        return PortfolioResponse.from(repository.save(document));
    }

    public PortfolioResponse update(String id, PortfolioRequest request) {
        validateId(id);
        PortfolioDocument document = repository.findById(id)
                .orElseThrow(() -> new PortfolioNotFoundException(id));
        document.update(
                request.title(),
                request.description(),
                request.content(),
                request.imageUrl(),
                request.githubUrl(),
                request.demoUrl(),
                request.links(),
                request.tags(),
                LocalDateTime.now());
        return PortfolioResponse.from(repository.save(document));
    }

    public void delete(String id) {
        validateId(id);
        if (!repository.existsById(id)) {
            throw new PortfolioNotFoundException(id);
        }
        repository.deleteById(id);
    }

    private void validateId(String id) {
        if (!ObjectId.isValid(id)) {
            throw new InvalidPortfolioIdException(id);
        }
    }
}
