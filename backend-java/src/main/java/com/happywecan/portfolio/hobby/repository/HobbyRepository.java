package com.happywecan.portfolio.hobby.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.happywecan.portfolio.hobby.domain.HobbyDocument;

public interface HobbyRepository extends MongoRepository<HobbyDocument, String> {
}
