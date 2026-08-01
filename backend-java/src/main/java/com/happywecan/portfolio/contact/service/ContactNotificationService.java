package com.happywecan.portfolio.contact.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class ContactNotificationService {
    private final JavaMailSender mailSender;
    private final String from;
    private final String notifyTo;

    public ContactNotificationService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username:}") String from,
            @Value("${CONTACT_NOTIFY_TO:}") String notifyTo) {
        this.mailSender = mailSender;
        this.from = from;
        this.notifyTo = notifyTo.isBlank() ? from : notifyTo;
    }

    @Async
    public void send(String name, String email, String message) {
        if (from.isBlank() || notifyTo.isBlank()) return;
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(from);
            mail.setTo(notifyTo);
            mail.setReplyTo(email);
            mail.setSubject("[Portfolio Contact] " + name);
            mail.setText("Name: " + name + "\nEmail: " + email + "\n\n" + message);
            mailSender.send(mail);
        } catch (RuntimeException ignored) {
            // The contact has already been persisted; SMTP failure must not lose the submission.
        }
    }
}
