package com.happywecan.portfolio.shared.error;

public class PortfolioNotFoundException extends RuntimeException {

    public PortfolioNotFoundException(String id) {
        super("Portfolio item not found: " + id);
    }
}
