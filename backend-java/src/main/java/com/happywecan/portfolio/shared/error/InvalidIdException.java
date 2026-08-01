package com.happywecan.portfolio.shared.error;

public class InvalidIdException extends RuntimeException {

    public InvalidIdException(String resource, String id) {
        super("Invalid " + resource + " id: " + id);
    }
}
