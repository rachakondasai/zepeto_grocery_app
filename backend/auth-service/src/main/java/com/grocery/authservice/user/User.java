package com.grocery.authservice.user;

public record User(String username, String passwordHash, String role) {}