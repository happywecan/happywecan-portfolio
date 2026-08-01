package com.happywecan.portfolio.contact.repository;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.happywecan.portfolio.contact.domain.ContactDocument;

public interface ContactRepository extends MongoRepository<ContactDocument, String> {
    List<ContactDocument> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
