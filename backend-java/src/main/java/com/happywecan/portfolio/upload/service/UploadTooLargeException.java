package com.happywecan.portfolio.upload.service;

public class UploadTooLargeException extends RuntimeException {
    public UploadTooLargeException(String message) { super(message); }
}
