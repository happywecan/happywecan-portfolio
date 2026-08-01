package com.happywecan.portfolio.admin.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.happywecan.portfolio.admin.domain.AdminUserDocument;

public interface AdminUserRepository extends MongoRepository<AdminUserDocument, String> {

    Optional<AdminUserDocument> findByEmailIgnoreCase(String email);
}
