package com.grocery.orderservice.model;
import java.time.Instant; import java.util.List;
public record Order(String id, String email, List<OrderItem> items, double total, Instant createdAt) {}
