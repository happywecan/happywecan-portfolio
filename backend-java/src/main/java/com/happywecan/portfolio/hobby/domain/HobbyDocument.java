package com.happywecan.portfolio.hobby.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "hobbies")
public record HobbyDocument(@Id String id, String name, String icon, String description) {
}
