package com.grocery.authservice.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class UserStore {
    private final Map<String, User> users = new ConcurrentHashMap<>();
    private final PasswordEncoder encoder;

    public UserStore(PasswordEncoder encoder) {
        this.encoder = encoder;
        // seed an admin for testing
        create("admin@grocery.app", "Admin@123", "ADMIN");
    }

    public User create(String username, String rawPassword, String role) {
        String hash = encoder.encode(rawPassword);
        User u = new User(username.toLowerCase(), hash, role);
        users.put(u.username(), u);
        return u;
    }

    public User find(String username) {
        return users.get(username.toLowerCase());
    }

    public boolean verify(String username, String rawPassword) {
        User u = find(username);
        return u != null && encoder.matches(rawPassword, u.passwordHash());
    }
}