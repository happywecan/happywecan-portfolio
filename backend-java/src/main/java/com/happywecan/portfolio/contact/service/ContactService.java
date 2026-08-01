package com.happywecan.portfolio.contact.service;

import java.time.Instant;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.happywecan.portfolio.contact.domain.ContactDocument;
import com.happywecan.portfolio.contact.repository.ContactRepository;
import com.happywecan.portfolio.contact.web.*;
import com.happywecan.portfolio.shared.error.InvalidIdException;
import com.happywecan.portfolio.shared.error.ResourceNotFoundException;

@Service
public class ContactService {
    private final ContactRepository repository;
    private final ContactNotificationService notifications;
    public ContactService(ContactRepository repository, ContactNotificationService notifications) {
        this.repository = repository;
        this.notifications = notifications;
    }
    public ContactDocument submit(ContactRequest request) {
        ContactDocument saved = repository.save(new ContactDocument(null, request.name().trim(),
                request.email().trim().toLowerCase(), request.message().trim(), Instant.now(), false, false));
        notifications.send(saved.name(), saved.email(), saved.message());
        return saved;
    }
    public List<ContactResponse> findAll(int limit) {
        return repository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit)).stream()
                .map(ContactResponse::from).toList();
    }
    public ContactResponse updateStatus(String id, ContactStatusRequest request) {
        validate(id);
        if (request.read() == null && request.replied() == null) {
            throw new IllegalArgumentException("No status fields provided");
        }
        ContactDocument value = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", id));
        ContactDocument updated = new ContactDocument(id, value.name(), value.email(), value.message(),
                value.createdAt(), request.read() == null ? value.read() : request.read(),
                request.replied() == null ? value.replied() : request.replied());
        return ContactResponse.from(repository.save(updated));
    }
    public void delete(String id) {
        validate(id);
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Contact", id);
        repository.deleteById(id);
    }
    private void validate(String id) { if (!ObjectId.isValid(id)) throw new InvalidIdException("contact", id); }
}
