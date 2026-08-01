package com.happywecan.portfolio.shared.error;

public class InvalidPortfolioIdException extends RuntimeException {

    public InvalidPortfolioIdException(String id) {
        super("Invalid portfolio id: " + id);
    }
}
