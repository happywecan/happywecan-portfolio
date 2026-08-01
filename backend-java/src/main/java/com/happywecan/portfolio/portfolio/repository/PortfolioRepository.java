package com.happywecan.portfolio.portfolio.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.happywecan.portfolio.portfolio.domain.PortfolioDocument;

public interface PortfolioRepository extends MongoRepository<PortfolioDocument, String> {

    List<PortfolioDocument> findAllByOrderByCreatedAtDesc();
}
