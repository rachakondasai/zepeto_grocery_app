package com.grocery.productservice.model;

public record Product(
        String id,
        String name,
        String category,
        String storeId,
        String storeName,
        String unit,
        double price,
        boolean available
) {}
